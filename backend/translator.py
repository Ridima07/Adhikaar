import concurrent.futures
from functools import lru_cache

from deep_translator import GoogleTranslator


SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "bn": "Bengali"
}


STATIC_TRANSLATIONS = {
    "Adhikaar backend is running": {
        "hi": "अधिकार बैकएंड सफलतापूर्वक चल रहा है",
        "bn": "অধিকার ব্যাকএন্ড সফলভাবে চলছে"
    },
    "Scheme not found": {
        "hi": "योजना नहीं मिली",
        "bn": "প্রকল্প খুঁজে পাওয়া যায়নি"
    },
    "None": {
        "hi": "कोई नहीं",
        "bn": "কোনোটিই নয়"
    },
    "No requirement": {
        "hi": "कोई आवश्यकता नहीं",
        "bn": "কোনো প্রয়োজন নেই"
    },
    "Open to all": {
        "hi": "सभी के लिए खुला",
        "bn": "সকলের জন্য উন্মুক্ত"
    },
    "Open to all occupations": {
        "hi": "सभी व्यवसायों के लिए खुला",
        "bn": "সমস্ত পেশার জন্য উন্মুক্ত"
    },
    "Yes": {
        "hi": "हाँ",
        "bn": "হ্যাঁ"
    },
    "No": {
        "hi": "नहीं",
        "bn": "না"
    },
    "Male": {
        "hi": "पुरुष",
        "bn": "পুরুষ"
    },
    "Female": {
        "hi": "महिला",
        "bn": "মহিলা"
    },
    "Other": {
        "hi": "अन्य",
        "bn": "অন্যান্য"
    },
    "You satisfy all the known eligibility conditions for this scheme.": {
        "hi": "आप इस योजना की सभी ज्ञात पात्रता शर्तों को पूरा करते हैं।",
        "bn": "আপনি এই প্রকল্পের সমস্ত পরিচিত যোগ্যতার শর্ত পূরণ করেন।"
    },
    "You satisfy all the known eligibility conditions for this scheme. Some conditions may still require official verification.": {
        "hi": "आप इस योजना की सभी ज्ञात पात्रता शर्तों को पूरा करते हैं। कुछ शर्तों के लिए अभी भी आधिकारिक सत्यापन आवश्यक हो सकता है।",
        "bn": "আপনি এই প্রকল্পের সমস্ত পরিচিত যোগ্যতার শর্ত পূরণ করেন। কিছু শর্তের জন্য এখনও সরকারি যাচাই প্রয়োজন হতে পারে।"
    }
}


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
    try:
        translated = GoogleTranslator(
            source="auto",
            target=target_lang
        ).translate(text)

        if not translated:
            return text

        if "Error 500" in translated:
            return text

        if "That’s an error" in translated:
            return text

        return translated

    except Exception:
        return text


@lru_cache(maxsize=4096)
def translate_text(
    text: str,
    target_lang: str = "en"
) -> str:

    if not text or not isinstance(text, str):
        return text

    target_lang = target_lang.lower().strip()

    if (
        target_lang == "en"
        or target_lang not in SUPPORTED_LANGUAGES
    ):
        return text

    if (
        text in STATIC_TRANSLATIONS
        and target_lang in STATIC_TRANSLATIONS[text]
    ):
        return STATIC_TRANSLATIONS[text][target_lang]

    clean = text.strip()

    if not clean:
        return text

    if clean.isdigit():
        return text

    if clean.startswith("http://"):
        return text

    if clean.startswith("https://"):
        return text

    if len(clean) <= 1:
        return text

    return _fetch_translation(
        text,
        target_lang
    )


def _collect_strings(data):
    """
    Collect all translatable strings from a response.
    Dictionary keys are intentionally ignored.
    """

    strings = set()

    def walk(value):
        if isinstance(value, dict):
            for key, child in value.items():

                if key in SKIP_KEYS:
                    continue

                walk(child)

        elif isinstance(value, list):
            for item in value:
                walk(item)

        elif isinstance(value, str):
            if value.strip():
                strings.add(value)

    walk(data)

    return strings


def translate_data(
    data,
    target_lang: str = "en"
):
    """
    Translate backend response values while preserving
    the original JSON structure and keys.

    Strings are translated concurrently so large responses,
    especially personalization questions, do not stall.
    """

    target_lang = target_lang.lower().strip()

    if (
        target_lang == "en"
        or target_lang not in SUPPORTED_LANGUAGES
    ):
        return data

    strings = _collect_strings(data)

    translations = {}

    if strings:
        with concurrent.futures.ThreadPoolExecutor(
            max_workers=8
        ) as executor:

            futures = {
                text: executor.submit(
                    translate_text,
                    text,
                    target_lang
                )
                for text in strings
            }

            for text, future in futures.items():
                try:
                    translations[text] = future.result(
                        timeout=8
                    )
                except Exception:
                    translations[text] = text

    def rebuild(value):
        if isinstance(value, dict):
            result = {}

            for key, child in value.items():

                if key in SKIP_KEYS:
                    result[key] = child
                else:
                    result[key] = rebuild(child)

            return result

        if isinstance(value, list):
            return [
                rebuild(item)
                for item in value
            ]

        if isinstance(value, str):
            return translations.get(
                value,
                value
            )

        return value

    return rebuild(data)