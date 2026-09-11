"""
Adhikaar - Personalization Condition Engine

This module provides one shared interpretation layer for
scheme-specific conditions stored inside `eligibility.other_conditions`.

Used by:
    - questions.py
    - matcher.py

Goal:
    Avoid adding separate hardcoded condition checks to matcher.py
    every time a new scheme introduces a condition.

The condition engine:
    1. Detects known condition concepts from scheme text.
    2. Knows which profile field represents each concept.
    3. Knows how to evaluate the user's answer.
    4. Provides question metadata for the question engine.
"""

from copy import deepcopy


# ============================================================
# CONDITION DEFINITIONS
# ============================================================

CONDITION_DEFINITIONS = {

    "first_year_pg": {
        "profile_field": "is_first_year_pg",

        "keywords": [
            "1st year",
            "first year",
        ],

        "requires_any": [
            "master",
            "pg",
        ],

        "question": {
            "id": "is_first_year_pg",
            "question": (
                "Are you currently in the 1st year of your "
                "Master's/PG programme?"
            ),
            "type": "boolean",
            "options": ["Yes", "No"],
        },

        "positive_message":
            "First-year PG status: requirement satisfied",

        "negative_message":
            "First-year PG status: requirement not satisfied",

        "missing_message":
            "First-year PG status: required",
    },


    "regular_full_time": {
        "profile_field": "is_regular_full_time",

        "keywords": [
            "regular",
            "full-time",
            "full time",
        ],

        "question": {
            "id": "is_regular_full_time",
            "question":
                "Are you enrolled in a regular, full-time programme?",
            "type": "boolean",
            "options": ["Yes", "No"],
        },

        "positive_message":
            "Regular/full-time status: requirement satisfied",

        "negative_message":
            "Regular/full-time status: requirement not satisfied",

        "missing_message":
            "Regular/full-time status: required",
    },


    "non_professional": {
        "profile_field": "is_non_professional",

        "keywords": [
            "non-professional",
            "non professional",
        ],

        "question": {
            "id": "is_non_professional",
            "question":
                "Is your course non-professional?",
            "type": "boolean",
            "options": ["Yes", "No"],
        },

        "positive_message":
            "Non-professional course: requirement satisfied",

        "negative_message":
            "Non-professional course: requirement not satisfied",

        "missing_message":
            "Non-professional course status: required",
    },


    "distance_education": {
        "profile_field": "is_distance_education",

        "keywords": [
            "distance education",
            "distance learning",
        ],

        "question": {
            "id": "is_distance_education",
            "question":
                "Are you pursuing your programme through "
                "distance education?",
            "type": "boolean",
            "options": ["Yes", "No"],
        },

        # IMPORTANT:
        # This condition normally means distance education
        # is NOT eligible.
        "positive_message":
            "Distance education restriction: requirement not satisfied",

        "negative_message":
            "Distance education restriction: requirement satisfied",

        "missing_message":
            "Distance education status: required",
    },


    "only_child": {
        "profile_field": "is_only_child",

        "keywords": [
            "only child",
            "single girl child",
        ],

        "question": {
            "id": "is_only_child",
            "question":
                "Are you the only child in your family?",
            "type": "boolean",
            "options": ["Yes", "No"],
        },

        "positive_message":
            "Only-child status: requirement satisfied",

        "negative_message":
            "Only-child status: requirement not satisfied",

        "missing_message":
            "Only-child status: required",
    },


    "residing_abroad": {
        "profile_field": "residing_abroad",

        "keywords": [
            "residing abroad",
            "reside abroad",
            "outside india",
            "abroad",
        ],

        "question": {
            "id": "residing_abroad",
            "question":
                "Are you currently residing outside India?",
            "type": "boolean",
            "options": ["Yes", "No"],
        },

        "positive_message":
            "Residence abroad: requirement satisfied",

        "negative_message":
            "Residence abroad: requirement not satisfied",

        "missing_message":
            "Residence abroad status: required",
    },


    "distress_situation": {
        "profile_field": "distress_situation",

        "keywords": [
            "distress",
            "emergency",
            "stranded",
        ],

        "question": {
            "id": "distress_situation",
            "question":
                "Are you currently facing a distress or "
                "emergency situation?",
            "type": "boolean",
            "options": ["Yes", "No"],
        },

        "positive_message":
            "Distress/emergency status: requirement satisfied",

        "negative_message":
            "Distress/emergency status: requirement not satisfied",

        "missing_message":
            "Distress/emergency status: required",
    },
}


# ============================================================
# HELPERS
# ============================================================

def normalize_condition_text(conditions):
    """
    Convert other_conditions into one lowercase string.
    """

    if conditions is None:
        return ""

    if not isinstance(conditions, list):
        conditions = [conditions]

    return " ".join(
        str(condition).lower()
        for condition in conditions
    )


def get_other_conditions(scheme):
    """
    Safely retrieve eligibility.other_conditions.
    """

    eligibility = scheme.get("eligibility", {})

    if not isinstance(eligibility, dict):
        return []

    conditions = eligibility.get(
        "other_conditions",
        []
    )

    if not isinstance(conditions, list):
        conditions = [conditions]

    return conditions


def get_condition_text(scheme):
    """
    Return normalized other-condition text.
    """

    return normalize_condition_text(
        get_other_conditions(scheme)
    )


def condition_applies(condition_key, scheme):
    """
    Determine whether a condition concept is present
    in the scheme's other_conditions.
    """

    definition = CONDITION_DEFINITIONS.get(
        condition_key
    )

    if not definition:
        return False

    text = get_condition_text(scheme)

    keywords = definition.get(
        "keywords",
        []
    )

    if not any(
        keyword in text
        for keyword in keywords
    ):
        return False

    # Some conditions require additional context.
    requires_any = definition.get(
        "requires_any",
        []
    )

    if requires_any:
        return any(
            keyword in text
            for keyword in requires_any
        )

    return True


def get_applicable_conditions(scheme):
    """
    Return all condition definitions that apply
    to the supplied scheme.
    """

    applicable = []

    for condition_key in CONDITION_DEFINITIONS:

        if condition_applies(
            condition_key,
            scheme
        ):
            applicable.append(
                condition_key
            )

    return applicable


# ============================================================
# QUESTION GENERATION
# ============================================================

def get_condition_questions(
    scheme,
    profile=None
):
    """
    Generate questions for applicable conditions
    whose profile information is not already known.
    """

    if profile is None:
        profile = {}

    questions = []

    for condition_key in get_applicable_conditions(
        scheme
    ):

        definition = CONDITION_DEFINITIONS[
            condition_key
        ]

        field = definition[
            "profile_field"
        ]

        value = profile.get(field)

        # Already known.
        if value is not None and value != "":
            continue

        question = deepcopy(
            definition["question"]
        )

        questions.append(question)

    return questions


# ============================================================
# CONDITION EVALUATION
# ============================================================

def _get_boolean_value(value):
    """
    Convert common UI values into True / False / None.
    """

    if isinstance(value, bool):
        return value

    if value is None:
        return None

    if isinstance(value, str):

        normalized = value.strip().lower()

        if normalized == "yes":
            return True

        if normalized == "no":
            return False

    return None


def evaluate_condition(
    condition_key,
    profile
):
    """
    Evaluate one personalization condition.

    Returns:
        "matched"
        "failed"
        "missing"
    """

    definition = CONDITION_DEFINITIONS.get(
        condition_key
    )

    if not definition:
        return "missing"

    field = definition[
        "profile_field"
    ]

    value = _get_boolean_value(
        profile.get(field)
    )

    if value is None:
        return "missing"

    # Distance education is a NEGATIVE requirement:
    # distance = True means failure.
    if condition_key == "distance_education":

        if value is False:
            return "matched"

        return "failed"

    # Normal positive conditions.
    if value is True:
        return "matched"

    return "failed"


def evaluate_conditions(
    scheme,
    profile
):
    """
    Evaluate all applicable personalization conditions.

    Returns:
        {
            "matched": [...],
            "failed": [...],
            "missing": [...]
        }
    """

    matched = []
    failed = []
    missing = []

    for condition_key in get_applicable_conditions(
        scheme
    ):

        definition = CONDITION_DEFINITIONS[
            condition_key
        ]

        result = evaluate_condition(
            condition_key,
            profile
        )

        if result == "matched":

            matched.append(
                definition[
                    "positive_message"
                ]
            )

        elif result == "failed":

            failed.append(
                definition[
                    "negative_message"
                ]
            )

        else:

            missing.append(
                definition[
                    "missing_message"
                ]
            )

    return {
        "matched": matched,
        "failed": failed,
        "missing": missing,
    }