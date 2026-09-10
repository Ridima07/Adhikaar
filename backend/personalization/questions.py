"""
Adhikaar - Scheme Personalization Question Engine

Stage 2 flow:

1. User receives Stage 1 recommendations.
2. User selects "Personalize".
3. The question engine examines the selected scheme.
4. It identifies scheme-specific information that is missing.
5. It generates relevant questions.
6. User answers are converted into profile fields.
7. The updated profile is passed to personalized eligibility/ranking.

Question interpretation is delegated to condition_engine.py.
"""

from copy import deepcopy

from backend.personalization.condition_engine import (
    get_condition_questions,
)


# ============================================================
# MAIN QUESTION ENGINE
# ============================================================

def get_personalization_questions(
    scheme,
    profile=None
):
    """
    Generate scheme-specific personalization questions.

    The questions are determined from the scheme's
    eligibility data and the information already known
    about the user.

    Parameters
    ----------
    scheme : dict
        Scheme object from schemes.json.

    profile : dict, optional
        Existing Stage 1 user profile.

    Returns
    -------
    list
        Relevant question dictionaries.
    """

    if profile is None:
        profile = {}

    return get_condition_questions(
        scheme,
        profile
    )


# ============================================================
# ANSWER PROCESSING
# ============================================================

def _convert_answer(value):
    """
    Convert UI answers into useful Python values.

    Yes -> True
    No  -> False

    Other values are preserved.
    """

    if isinstance(value, str):

        normalized = value.strip().lower()

        if normalized == "yes":
            return True

        if normalized == "no":
            return False

    return value


def apply_personalization_answers(
    profile,
    answers
):
    """
    Merge personalization answers into the user's profile.

    The original profile is not modified.
    """

    updated_profile = deepcopy(
        profile
    )

    if not isinstance(
        answers,
        dict
    ):
        return updated_profile

    for key, value in answers.items():

        updated_profile[key] = (
            _convert_answer(value)
        )

    return updated_profile


# ============================================================
# VALIDATION
# ============================================================

def validate_personalization_answers(
    questions,
    answers
):
    """
    Validate that every generated question
    has an answer.
    """

    if not isinstance(
        answers,
        dict
    ):

        return {
            "valid": False,
            "missing": [
                question.get("id")
                for question in questions
                if question.get("id")
            ],
        }

    missing = []

    for question in questions:

        question_id = question.get("id")

        if not question_id:
            continue

        if question_id not in answers:

            missing.append(
                question_id
            )

    return {
        "valid": len(missing) == 0,
        "missing": missing,
    }