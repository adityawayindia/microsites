import os
from pathlib import Path

from sarvamai import SarvamAI
from sarvamai.core.api_error import ApiError


def main():
    env_file = Path(__file__).with_name(".env")
    if "SARVAM_API_KEY" not in os.environ and env_file.is_file():
        for line in env_file.read_text(encoding="utf-8-sig").splitlines():
            name, separator, value = line.partition("=")
            if separator and name.strip() == "SARVAM_API_KEY":
                os.environ[name.strip()] = value.strip()
                break

    key = os.getenv("SARVAM_API_KEY")
    if not key:
        raise SystemExit("Set SARVAM_API_KEY in the environment or project .env file.")

    client = SarvamAI(api_subscription_key=key)
    try:
        result = client.text.translate(
            input="Book Appointment",
            source_language_code="en-IN",
            target_language_code="hi-IN",
            model="sarvam-translate:v1",
        )
    except ApiError as error:
        raise SystemExit(f"Sarvam returned HTTP {error.status_code}.") from None
    print(result.translated_text)


if __name__ == "__main__":
    main()
