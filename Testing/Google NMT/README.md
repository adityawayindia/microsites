# Google NMT testing microsites

`microsite-testing-male` is the browser preview. `microsite-testing-male-param` is its backend template. The preview starts in English. The language menu also offers the languages listed in `microsite-testing-male/drafts/review_report.json` after a completed translation run.

From the workspace root, check the English inputs without contacting Google.

```powershell
.\.venv\Scripts\python.exe "Testing/Google NMT/translate.py" --language hi --dry-run
```

For a live run, use a Google Cloud project with billing, the Cloud Translation API enabled, and a local Application Default Credentials login with translation access. [Google Cloud Translation setup](https://docs.cloud.google.com/translate/docs/setup)

```powershell
$env:GOOGLE_CLOUD_PROJECT = "your-project-id"
.\.venv\Scripts\python.exe "Testing/Google NMT/translate.py" --language hi
```

Use `--language or` for Odia or `--language bn` for Bengali. Each completed language appears in the preview alongside earlier ones. To regenerate an existing language for comparison, add `--output drafts_v2`.

The script reads public English strings from `locales/en.json` and `content/doctor.en.json`. It uses saved wording when the field and English text both match, then translates other strings through Google's `general/nmt` model or its local cache. It saves the results under `drafts/locales` and `drafts/content` for bilingual review.

Keep buttons and headings short and familiar. In paragraphs, use everyday words while preserving medical details, conditions, warnings and numbers. The Hindi wording edits are in `wording/hi.json`. Each entry records the English source so an edit to the source gets a fresh translation.

The preview combines the drafts with the original doctor facts and locally supplied display spellings. Switching languages makes zero Google Translation calls.
