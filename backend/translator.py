from functools import lru_cache
from deep_translator import GoogleTranslator

SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "bn": "Bengali"
}

# Static translations for common status strings to avoid network calls & errors
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

# Keys whose values should NEVER be translated
SKIP_KEYS = {
    "scheme_id",
    "source_url",
    "official_portal",
    "last_verified",
    "supported_languages",
    "total_recommendations"
}

@lru_cache(maxsize=2048)
def translate_text(text: str, target_lang: str = "en") -> str:
    """Translates a string safely, returning original text on failure."""
    if not text or not isinstance(text, str):
        return text

    target_lang = target_lang.lower().strip()
    if target_lang == "en" or target_lang not in SUPPORTED_LANGUAGES:
        return text

    # Check static cache first
    if text in STATIC_TRANSLATIONS and target_lang in STATIC_TRANSLATIONS[text]:
        return STATIC_TRANSLATIONS[text][target_lang]

    # Don't translate pure numbers or single-character symbols
    if text.strip().isdigit() or len(text.strip()) <= 1:
        return text

    try:
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        # If Google returns an error HTML string, fallback to original
        if "Error 500" in translated or "That’s an error" in translated:
            return text
        return translated
    except Exception:
        return text

def translate_data(data, target_lang: str = "en"):
    """Recursively traverses data structures without translating system keys."""
    if target_lang == "en" or target_lang not in SUPPORTED_LANGUAGES:
        return data

    if isinstance(data, dict):
        translated_dict = {}
        for key, value in data.items():
            if key in SKIP_KEYS:
                translated_dict[key] = value
            else:
                translated_dict[key] = translate_data(value, target_lang)
        return translated_dict

    elif isinstance(data, list):
        return [translate_data(item, target_lang) for item in data]

    elif isinstance(data, str):
        return translate_text(data, target_lang)

    return data