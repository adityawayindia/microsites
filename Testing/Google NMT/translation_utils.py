"""Small JSON translation pipeline. No API calls happen on website visits."""
from __future__ import annotations
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import sys
from typing import Any, Callable
import unicodedata

# Deliberately supports simple placeholders, not HTML or ICU plural expressions.
PLACEHOLDER = re.compile(r"\{\{[A-Za-z_][A-Za-z0-9_.]*\}\}|\{[A-Za-z_][A-Za-z0-9_.]*\}")
MARKER = re.compile(r"QZXPH\d{4}QZX")


def unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Duplicate JSON key: {key}")
        result[key] = value
    return result


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8-sig"),
                      object_pairs_hook=unique_object)


def save_json(path: Path, value: Any) -> None:
    """Write complete JSON, not an append of individual API responses."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n",
                         encoding="utf-8")
    temporary.replace(path)


def split_text(text: str, limit: int) -> list[tuple[str, str]]:
    """Return (text, separator) chunks; keep every original separator.

    Prefer paragraph/sentence boundaries, then spaces. Never cut a word.
    Limits count Python Unicode characters, not UTF-8 file bytes.
    """
    if limit < 20:
        raise ValueError("Chunk size must be at least 20 characters.")
    chunks = []
    remaining = text
    while len(remaining) > limit:
        boundary = None
        for pattern in (r"\n+", r"(?<=[.!?])\s+", r"\s+"):
            candidates = [m for m in re.finditer(pattern, remaining)
                          if 0 < m.start() <= limit]
            if candidates:
                boundary = candidates[-1]
                break
        if boundary is None:
            raise ValueError("One word is longer than the chunk limit. Edit this value manually.")
        chunks.append((remaining[:boundary.start()], boundary.group()))
        remaining = remaining[boundary.end():]
    if remaining:
        chunks.append((remaining, ""))
    return chunks


def protect(text: str) -> tuple[str, dict[str, str]]:
    if "QZXPH" in text:
        raise ValueError("The text contains a reserved placeholder marker.")
    mapping = {}
    def replace(match: re.Match[str]) -> str:
        marker = f"QZXPH{len(mapping):04d}QZX"
        mapping[marker] = match.group()
        return marker
    masked = PLACEHOLDER.sub(replace, text)
    if "{" in masked or "}" in masked or re.search(r"</?[A-Za-z][^>]*>", masked):
        raise ValueError("Use plain text JSON values. HTML and ICU expressions need manual handling.")
    return masked, mapping


def restore(text: str, mapping: dict[str, str]) -> str:
    if Counter(MARKER.findall(text)) != Counter(mapping.keys()):
        raise ValueError("Translation changed a placeholder. Do not publish; review this value manually.")
    for marker, original in mapping.items():
        text = text.replace(marker, original)
    return text


def number_tokens(text: str) -> list[str]:
    # Native script digits are treated as equivalent to 0-9.
    normalized = ''.join(str(unicodedata.decimal(c)) if c.isdecimal() else c
                         for c in text)
    normalized = PLACEHOLDER.sub('', normalized)
    return re.findall(r"\d+(?:[.,]\d+)*", normalized)


def load_wording(language: str) -> dict[str, dict[str, str]]:
    path = Path(__file__).resolve().parent / 'wording' / f'{language}.json'
    if not path.exists():
        return {}
    entries = read_json(path)
    for field, entry in entries.items():
        source, target = entry['source'], entry['translation']
        protect(target)
        if (not target.strip()
                or Counter(PLACEHOLDER.findall(source)) != Counter(PLACEHOLDER.findall(target))
                or Counter(number_tokens(source)) != Counter(number_tokens(target))):
            raise ValueError(f'Check the saved {language} wording for {field}.')
    return entries


def walk(node: Any, translate: Callable[[str, str], str], path: str = "$"
         ) -> Any:
    """Translate string values only. Preserve keys, nesting, arrays and numbers."""
    if isinstance(node, dict):
        return {key: walk(value, translate, f"{path}.{key}")
                for key, value in node.items()}
    if isinstance(node, list):
        return [walk(value, translate, f"{path}[{i}]")
                for i, value in enumerate(node)]
    if isinstance(node, str):
        return translate(node, path)
    return node


class Translator:
    def __init__(self, call_api: Callable[[str, str], str] | None,
                 identity: str, limit: int, cache_path: Path, dry_run: bool,
                 wording: dict | None = None):
        self.call_api, self.identity, self.limit = call_api, identity, limit
        self.cache_path, self.dry_run = cache_path, dry_run
        self.cache = read_json(cache_path) if cache_path.exists() else {}
        if not isinstance(self.cache, dict):
            raise ValueError("Invalid cache file.")
        self.calls = self.characters = self.cache_hits = 0
        self.warnings = []
        self.wording = wording or {}
        self.wording_counts = Counter()

    def value(self, text: str, language: str, context: str) -> str:
        entry = self.wording.get(language, {}).get(context)
        if entry and entry['source'] == text:
            self.wording_counts[language] += 1
            if 'review_note' in entry:
                self.warnings.append({'language': language, 'field': context, 'issue': entry['review_note']})
            return entry['translation']
        if not text.strip():
            return text
        match = re.fullmatch(r"(\s*)(.*?)(\s*)", text, re.S)
        leading, core, trailing = match.groups()
        masked, mapping = protect(core)
        if masked in mapping:  # Value is only a placeholder; no translation needed.
            return text
        translated = []
        for chunk, separator in split_text(masked, self.limit):
            key_data = ["v1", self.identity, language, chunk]
            key = hashlib.sha256(json.dumps(key_data, ensure_ascii=False).encode()).hexdigest()
            expected = Counter(MARKER.findall(chunk))
            if key in self.cache:
                result = self.cache[key]
                self.cache_hits += 1
            elif self.dry_run:
                self.calls += 1
                self.characters += len(chunk)
                result = chunk  # Used only to inspect the pipeline; never written as a translation.
                self.cache[key] = result  # Count repeated strings once during a dry run too.
            else:
                self.calls += 1
                self.characters += len(chunk)
                result = self.call_api(chunk, language)
                if not isinstance(result, str) or not result.strip():
                    raise ValueError(f"Empty API response at {context}.")
                result = result.strip()
                if Counter(MARKER.findall(result)) != expected:
                    raise ValueError(f"Placeholder changed at {context}. Review manually.")
                self.cache[key] = result
                save_json(self.cache_path, self.cache)
            if not isinstance(result, str) or Counter(MARKER.findall(result)) != expected:
                raise ValueError(f"Invalid cached result at {context}.")
            translated.append(result + separator)
        output = leading + restore(''.join(translated), mapping) + trailing
        if not self.dry_run and Counter(number_tokens(text)) != Counter(number_tokens(output)):
            self.warnings.append({"language": language, "field": context,
                                  "issue": "Numbers differ. Bilingual review required."})
        return output


def run_cli(identity: str, default_limit: int, maximum_limit: int,
            factory: Callable[[], Callable[[str, str], str]]) -> None:
    site = Path(__file__).resolve().parent / 'microsite-testing-male'
    parser = argparse.ArgumentParser(description="Generate the Hindi, Odia and Bengali Google NMT test drafts.")
    parser.add_argument('--template', type=Path, default=site / 'locales/en.json')
    parser.add_argument('--doctor', type=Path, default=site / 'content/doctor.en.json')
    parser.add_argument('--output', type=Path, default=site / 'drafts')
    parser.add_argument('--language', choices=('hi', 'or', 'bn'), action='append',
                        help="Translate only this language. Repeat to select more than one.")
    parser.add_argument('--chunk-size', type=int, default=default_limit)
    parser.add_argument('--dry-run', action='store_true', help="Check inputs; no API calls or output files.")
    args = parser.parse_args()
    try:
        if not 20 <= args.chunk_size <= maximum_limit:
            raise ValueError(f"Chunk size must be between 20 and {maximum_limit}.")
        sources = [('locales', args.template), ('content', args.doctor)]
        documents = [(kind, read_json(path)) for kind, path in sources]
        languages = list(dict.fromkeys(args.language or ['hi', 'or', 'bn']))
        jobs = [(kind, document, lang,
                 args.output / kind / (f'{lang}.json' if kind == 'locales' else f'doctor.{lang}.json'))
                for kind, document in documents for lang in languages]
        if any(not isinstance(document, dict) for _, document in documents):
            raise ValueError("Each input must be a JSON object.")
        if not args.dry_run and any(dest.exists() for *_, dest in jobs):
            raise ValueError("Draft files already exist. Use --output drafts_v2 to preserve edits.")
        report_path = args.output / 'review_report.json'
        previous = read_json(report_path) if report_path.exists() else {}
        wording = {lang: load_wording(lang) for lang in languages}

        # Validate ALL source fields before any chargeable API call.
        def validate(text: str, path: str) -> str:
            masked, _ = protect(text.strip())
            split_text(masked, args.chunk_size)
            return text
        for _, document in documents:
            walk(document, validate)

        api = None if args.dry_run else factory()
        engine = Translator(api, identity, args.chunk_size,
                            Path(__file__).resolve().parent / '.translation_cache.json', args.dry_run, wording)
        completed = []
        for kind, document, language, destination in jobs:
            translated = walk(document, lambda text, path: engine.value(text, language, path), path=kind)
            completed.append((destination, translated))
            print(f"{'CHECK' if args.dry_run else 'READY'} {destination}")
        if not args.dry_run:
            # API failure leaves no partially translated JSON files in the output.
            for destination, translated in completed:
                save_json(destination, translated)
            save_json(report_path, {
                'status': 'DRAFT_REQUIRES_BILINGUAL_REVIEW',
                'provider': identity,
                'languages': list(dict.fromkeys(previous.get('languages', []) + languages)),
                'files': previous.get('files', []) + [str(dest) for dest, _ in completed],
                'warnings': previous.get('warnings', []) + engine.warnings,
                'api_chunks': previous.get('api_chunks', 0) + engine.calls,
                'input_characters': previous.get('input_characters', 0) + engine.characters,
                'cache_hits': previous.get('cache_hits', 0) + engine.cache_hits,
                'local_wording_fields': {**previous.get('local_wording_fields', {}), **engine.wording_counts},
                'wording_review': {
                    'buttons_and_headings': 'Use short, familiar wording that clearly names the action or topic.',
                    'body_text': 'Use everyday patient-facing language. Preserve every fact, condition, negation, number and instruction from the English.',
                },
                'note': 'No medical accuracy guarantee. No website deployment performed.'})
        print(f"API chunks: {engine.calls}; input characters: {engine.characters}; cache hits: {engine.cache_hits}")
        print("DRY RUN: no API calls and no translation files written." if args.dry_run
              else "Drafts saved. Review every translation before copying it into your site.")
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
