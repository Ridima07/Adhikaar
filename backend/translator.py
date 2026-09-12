import concurrent.futures
from functools import lru_cache
from deep_translator import GoogleTranslator

SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "bn": "Bengali"
}

# Fast static cache for common strings
STATIC_TRANSLATIONS = {
    "Adhikaar backend is running": {
        "hi": "अधिकार बैकएंड सफलतापूर्वक चल रहा है",
        "bn": "অধিকার ব্যাকএন্ড সফলভাবে চলছে"
    },
    "Scheme not found": {
        "hi": "योजना नहीं मिली",
        "bn": "প্রকল্প খুঁজে পাওয়া যায়নি"
    }
}

# Technical fields that should never be translated
SKIP_KEYS = {
    "scheme_id",
    "source_url",
    "official_portal",
    "last_verified",
    "supported_languages",
    "total_recommendations",
    "manual_verification_required",
    "manual_verification_reason",
    "beneficiary_level"
}

def _fetch_translation(text: str, target_lang: str) -> str:
    """Raw network call to Google Translate."""
    try:
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        if not translated or "Error 500" in translated or "That’s an error" in translated:
            return text
        return translated
    except Exception:
        return text

@lru_cache(maxsize=2048)
def translate_text(text: str, target_lang: str = "en") -> str:
    """Translates text with a strict 3-second timeout to prevent hanging."""
    if not text or not isinstance(text, str):
        return text

    target_lang = target_lang.lower().strip()
    if target_lang == "en" or target_lang not in SUPPORTED_LANGUAGES:
        return text

    if text in STATIC_TRANSLATIONS and target_lang in STATIC_TRANSLATIONS[text]:
        return STATIC_TRANSLATIONS[text][target_lang]

    # Skip numbers, URLs, and short symbols
    clean = text.strip()
    if clean.isdigit() or len(clean) <= 1 or clean.startswith("http"):
        return text

    # Run with a 3-second hard timeout
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(_fetch_translation, text, target_lang)
        try:
            return future.result(timeout=3.0)
        except concurrent.futures.TimeoutError:
            return text  # Return original if translation service hangs

def translate_data(data, target_lang: str = "en"):
    """Recursively translates payloads safely."""
    if target_lang == "en" or target_lang not in SUPPORTED_LANGUAGES:
        return data

    if isinstance(data, dict):
        return {
            key: value if key in SKIP_KEYS else translate_data(value, target_lang)
            for key, value in data.items()
        }

    elif isinstance(data, list):
        return [translate_data(item, target_lang) for item in data]

    elif isinstance(data, str):
        return translate_text(data, target_lang)

    return data