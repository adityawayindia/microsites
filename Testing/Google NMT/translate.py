"""Generate Google NMT testing drafts. Use --dry-run to check inputs offline."""
from __future__ import annotations
import os
from translation_utils import run_cli


def create_api():
    # Lazy imports allow --dry-run and tests without cloud packages or credentials.
    from google.cloud import translate_v3
    from google.api_core import exceptions, retry
    project = os.environ.get('GOOGLE_CLOUD_PROJECT', '').strip()
    if not project:
        raise ValueError('Set GOOGLE_CLOUD_PROJECT to your real project ID.')
    client = translate_v3.TranslationServiceClient()
    parent = f'projects/{project}/locations/global'
    retry_policy = retry.Retry(
        predicate=retry.if_exception_type(exceptions.TooManyRequests,
            exceptions.ServiceUnavailable, exceptions.InternalServerError,
            exceptions.DeadlineExceeded),
        initial=1, maximum=8, multiplier=2, timeout=60)

    def translate_chunk(text: str, target_language: str) -> str:
        response = client.translate_text(
            request={
                'parent': parent,
                'model': f'{parent}/models/general/nmt',
                'source_language_code': 'en',
                'target_language_code': target_language,
                'mime_type': 'text/plain',
                'contents': [text],
            },
            retry=retry_policy,
            timeout=30,
        )
        if len(response.translations) != 1:
            raise RuntimeError('Expected one Google translation for this chunk.')
        return response.translations[0].translated_text
    return translate_chunk


if __name__ == '__main__':
    run_cli('google:general/nmt:plain-text', 4000, 5000, create_api)
