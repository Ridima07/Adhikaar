"""
Personalized scheme ranking for Adhikaar.

Stage 2 flow:

Basic profile
    ↓
Initial scheme recommendations
    ↓
User clicks "Personalize"
    ↓
Scheme-specific questions
    ↓
User answers
    ↓
Profile is updated
    ↓
Eligibility is re-checked
    ↓
ML model ranks the eligible schemes
"""

from backend.personalization.questions import (
    get_personalization_questions,
    apply_personalization_answers,
)
from backend.matcher import check_eligibility


def personalize_schemes(profile, schemes, answers_by_scheme):
    """
    Personalize and rank schemes using scheme-specific answers.

    Parameters
    ----------
    profile : dict
        User's existing profile.

    schemes : list
        List of scheme dictionaries from schemes.json.

    answers_by_scheme : dict
        Answers collected for each scheme.

        Example:
        {
            "EDU006": {
                "is_first_year_pg": "Yes",
                "is_regular_full_time": "Yes",
                "is_distance_education": "No"
            }
        }

    Returns
    -------
    list
        Personalized scheme results sorted by match percentage.
    """

    personalized_results = []

    for scheme in schemes:

        scheme_id = scheme.get("scheme_id")

        # --------------------------------------------------
        # 1. Get answers for this scheme
        # --------------------------------------------------

        answers = answers_by_scheme.get(scheme_id, {})

        # --------------------------------------------------
        # 2. Add personalization answers to profile
        # --------------------------------------------------

        updated_profile = apply_personalization_answers(
            profile,
            answers
        )

        # --------------------------------------------------
        # 3. Run the existing matcher
        # --------------------------------------------------

        result = check_eligibility(
    scheme,
    updated_profile
)

        # --------------------------------------------------
        # 4. Store personalized result
        # --------------------------------------------------

        personalized_results.append({
            "scheme_id": scheme_id,
            "scheme_name": scheme.get("scheme_name"),
            "category": scheme.get("category"),
            "status": result.get("status"),
            "match_percentage": result.get("match_percentage", 0),
            "eligibility_summary": result.get(
                "eligibility_summary",
                ""
            ),
            "matched_conditions": result.get(
                "matched_conditions",
                []
            ),
            "failed_conditions": result.get(
                "failed_conditions",
                []
            ),
            "missing_information": result.get(
                "missing_information",
                []
            ),
            "additional_conditions": result.get(
                "additional_conditions",
                []
            ),
            "manual_verification_required": scheme.get(
                "manual_verification_required",
                False
            ),
            "manual_verification_reason": scheme.get(
                "manual_verification_reason"
            ),
        })

    # ------------------------------------------------------
    # 5. Keep only schemes that are actually eligible
    # ------------------------------------------------------

    eligible_results = [
        result
        for result in personalized_results
        if result["status"] == "eligible"
    ]

    # ------------------------------------------------------
    # 6. Rank using match percentage
    # ------------------------------------------------------

    eligible_results.sort(
        key=lambda x: x["match_percentage"],
        reverse=True
    )

    return eligible_results


def get_questions_for_scheme(scheme, profile):
    """
    Convenience function for the frontend/API.

    Returns only the questions that are still relevant
    based on the user's existing profile.
    """

    return get_personalization_questions(
        scheme,
        profile
    )