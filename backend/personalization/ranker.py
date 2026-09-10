"""
Adhikaar - Personalized Scheme Ranker

Stage 2:
Takes the user's original profile + personalization answers,
filters schemes using the rule-based matcher, and then uses
the ML relevance model to rank the remaining schemes.
"""

from typing import Dict, Any, List

from backend.matcher import (
    load_schemes,
    check_eligibility,
    predict_ml_relevance,
)


def rank_personalized_schemes(
    profile: Dict[str, Any],
    top_k: int = 5
) -> List[Dict[str, Any]]:
    """
    Rank schemes after personalization answers have been collected.

    Rule-based eligibility remains authoritative.
    ML is used only for ranking the schemes that remain.
    """

    schemes = load_schemes()

    candidates = []

    for scheme in schemes:

        # --------------------------------------------------
        # 1. RULE-BASED ELIGIBILITY
        # --------------------------------------------------

        eligibility_result = check_eligibility(
            scheme,
            profile
        )

        # Never recommend definitely ineligible schemes.
        if eligibility_result["status"] == "not_eligible":
            continue

        # --------------------------------------------------
        # 2. ML PERSONALIZED SCORE
        # --------------------------------------------------

        ml_score = predict_ml_relevance(
            profile,
            scheme
        )

        # --------------------------------------------------
        # 3. STORE RESULT
        # --------------------------------------------------

        candidates.append({
            "scheme_id": scheme.get("scheme_id"),
            "scheme_name": scheme.get("scheme_name"),
            "category": scheme.get("category"),

            "benefit": scheme.get(
                "benefit",
                {}
            ),

            "status": eligibility_result.get(
                "status"
            ),

            "match_percentage": eligibility_result.get(
                "match_percentage",
                0
            ),

            "ml_relevance_score": ml_score,

            "eligibility_summary":
                eligibility_result.get(
                    "eligibility_summary",
                    ""
                ),

            "matched_conditions":
                eligibility_result.get(
                    "matched_conditions",
                    []
                ),

            "failed_conditions":
                eligibility_result.get(
                    "failed_conditions",
                    []
                ),

            "missing_information":
                eligibility_result.get(
                    "missing_information",
                    []
                ),

            "required_documents":
                scheme.get(
                    "required_documents",
                    []
                ),

            "application_steps":
                scheme.get(
                    "application_steps",
                    []
                ),

            "official_portal":
                scheme.get(
                    "official_portal"
                ),

            "source_url":
                scheme.get(
                    "source_url"
                ),

            "manual_verification_required":
                scheme.get(
                    "manual_verification_required",
                    False
                ),

            "manual_verification_reason":
                scheme.get(
                    "manual_verification_reason",
                    ""
                ),
        })

    # ------------------------------------------------------
    # 4. PERSONALIZED RANKING
    # ------------------------------------------------------

    candidates.sort(
        key=lambda x: (
            # Eligible schemes first
            0 if x["status"] == "eligible" else 1,

            # ML relevance
            -x["ml_relevance_score"],

            # Rule-based match
            -x["match_percentage"],

            # Stable ordering
            x["scheme_name"] or ""
        )
    )

    return candidates[:top_k]