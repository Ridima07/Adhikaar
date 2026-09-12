"""
Adhikaar - Benefit Gap Analysis

Identifies schemes that a user is close to qualifying for,
but currently misses because of a meaningful and potentially
actionable eligibility requirement.

The existing matcher remains the source of truth.

This module does NOT modify matcher.py.
"""

from typing import Dict, Any, List, Optional

from backend.matcher import (
    load_schemes,
    check_eligibility,
)


# ============================================================
# CONFIGURATION
# ============================================================

HARD_BLOCKER_FIELDS = {
    "age",
    "state",
    "district",
    "residence_requirement",
    "gender",
    "user_type",
    "occupation",
    "disability_status",
    "social_category",
}


ACTIONABLE_FIELDS = {
    "disability_percentage",
    "annual_income",
    "employment_status",
    "education_level",
    "course_type",
    "institution_type",
}


IGNORED_FIELDS = {
    "other_conditions",
    "age",
    "state",
    "district",
    "residence_requirement",
    "gender",
}


GENERIC_BLOCKER_PHRASES = {
    "requirement not satisfied",
    "profile does not currently satisfy",
    "does not currently satisfy",
}


# ============================================================
# FIELD HELPERS
# ============================================================

def _extract_field_from_condition(condition: Any) -> str:
    """
    Determine which eligibility field caused a condition to fail.
    """

    text = str(condition).lower().strip()

    field_patterns = [
        ("disability percentage", "disability_percentage"),
        ("disability status", "disability_status"),
        ("employment status", "employment_status"),
        ("social category", "social_category"),
        ("institution type", "institution_type"),
        ("education level", "education_level"),
        ("course type", "course_type"),
        ("user type", "user_type"),
        ("annual income", "annual_income"),
        ("income", "annual_income"),
        ("occupation", "occupation"),
        ("district", "district"),
        ("state", "state"),
        ("residence", "residence_requirement"),
        ("gender", "gender"),
        ("age", "age"),
    ]

    for keyword, field in field_patterns:
        if keyword in text:
            return field

    if "single girl" in text:
        return "user_type"

    if "only child" in text or "only-child" in text:
        return "user_type"

    if "first year" in text or "first-year" in text:
        return "education_level"

    if "full time" in text or "full-time" in text:
        return "course_type"

    if "non professional" in text or "non-professional" in text:
        return "course_type"

    if "distance education" in text:
        return "course_type"

    return ""


# ============================================================
# BLOCKER CLASSIFICATION
# ============================================================

def _is_hard_blocker(field: str) -> bool:
    return field in HARD_BLOCKER_FIELDS


def _is_ignored(field: str) -> bool:
    return field in IGNORED_FIELDS


def _is_actionable(field: str) -> bool:
    return field in ACTIONABLE_FIELDS


# ============================================================
# REQUIREMENT VALIDATION
# ============================================================

def _has_meaningful_requirement(
    scheme: Dict[str, Any],
    field: str,
) -> bool:
    """
    Check whether the scheme actually contains a requirement
    for the field.
    """

    eligibility = scheme.get("eligibility", {})

    if not isinstance(eligibility, dict):
        return False

    requirement = eligibility.get(field)

    if requirement is None:
        return False

    if requirement == []:
        return False

    if requirement == "":
        return False

    if field == "disability_status" and requirement is False:
        return False

    if isinstance(requirement, dict):
        meaningful_values = [
            value
            for key, value in requirement.items()
            if key != "original_text"
            and value not in (None, "", [], {})
        ]

        return bool(meaningful_values)

    return True


# ============================================================
# GENERIC FAILURE DETECTION
# ============================================================

def _is_generic_failure(condition: Any) -> bool:
    """
    Detect generic matcher messages.
    """

    text = str(condition).lower().strip()

    return any(
        phrase in text
        for phrase in GENERIC_BLOCKER_PHRASES
    )


# ============================================================
# EXPLANATIONS
# ============================================================

def _format_requirement(requirement: Any) -> str:
    """
    Convert a dataset requirement into readable text.
    """

    if requirement is None:
        return ""

    if isinstance(requirement, list):
        values = [
            str(value)
            for value in requirement
            if value not in (None, "", [])
        ]

        return ", ".join(values)

    if isinstance(requirement, dict):
        original_text = requirement.get("original_text")

        if original_text:
            return str(original_text)

        values = []

        minimum = requirement.get("min")
        maximum = requirement.get("max")

        if minimum is not None:
            values.append(f"minimum: {minimum}")

        if maximum is not None:
            values.append(f"maximum: {maximum}")

        return ", ".join(values)

    return str(requirement)


def _build_unlock_explanation(
    field: str,
    scheme: Dict[str, Any],
) -> str:
    """
    Build a user-facing explanation from the actual dataset.
    """

    eligibility = scheme.get("eligibility", {})

    requirement = eligibility.get(field)

    readable_requirement = _format_requirement(requirement)

    field_name = field.replace("_", " ")

    if readable_requirement:
        return (
            f"Meeting the scheme's {field_name} "
            f"requirement ({readable_requirement}) "
            f"could make you eligible."
        )

    return (
        f"Meeting the scheme's {field_name} "
        f"requirement could make you eligible."
    )


# ============================================================
# BENEFIT VALUE
# ============================================================

def _benefit_value(
    scheme: Dict[str, Any],
) -> Optional[float]:

    benefit = scheme.get("benefit", {})

    if not isinstance(benefit, dict):
        return None

    amount = benefit.get("amount")

    if isinstance(amount, (int, float)):
        return float(amount)

    return None


# ============================================================
# PROXIMITY
# ============================================================

def _calculate_proximity(
    eligibility_result: Dict[str, Any],
) -> float:

    value = eligibility_result.get(
        "match_percentage",
        0,
    )

    try:
        value = float(value)
    except (TypeError, ValueError):
        value = 0.0

    return round(
        max(
            0.0,
            min(
                100.0,
                value,
            ),
        ),
        2,
    )


# ============================================================
# BLOCKER QUALITY
# ============================================================

def _blocker_priority(field: str) -> int:
    """
    Smaller number = stronger Benefit Gap signal.
    """

    priority = {
        "course_type": 1,
        "education_level": 2,
        "institution_type": 3,
        "disability_percentage": 4,
        "disability_status": 5,
        "annual_income": 6,
        "employment_status": 7,
        "occupation": 8,
        "social_category": 9,
    }

    return priority.get(field, 99)


# ============================================================
# PROFILE-SPECIFIC CONDITIONS
# ============================================================

def _violates_profile_specific_condition(
    field: str,
    condition: Any,
    profile: Dict[str, Any],
) -> bool:
    """
    Detect important conditions that may not be represented
    cleanly by the structured eligibility fields.
    """

    text = str(condition).lower()

    if field == "education_level":
        if "first year" in text or "first-year" in text:
            if profile.get("is_first_year_pg") is False:
                return True

    if field == "course_type":
        if "first year" in text or "first-year" in text:
            if profile.get("is_first_year_pg") is False:
                return True

        if "full time" in text or "full-time" in text:
            if profile.get("is_regular_full_time") is False:
                return True

        if "non professional" in text or "non-professional" in text:
            if profile.get("is_non_professional") is False:
                return True

        if "distance education" in text:
            if profile.get("is_distance_education") is False:
                return True

    return False


# ============================================================
# INCOME GAP REALISM
# ============================================================

def _income_requirement_maximum(
    requirement: Any,
) -> Optional[float]:
    """
    Extract the maximum income threshold from a scheme's
    annual_income requirement.
    """

    if isinstance(requirement, dict):
        maximum = requirement.get("max")

        if isinstance(maximum, (int, float)):
            return float(maximum)

        return None

    if isinstance(requirement, list):
        maximums = []

        for item in requirement:
            if isinstance(item, dict):
                maximum = item.get("max")

                if isinstance(maximum, (int, float)):
                    maximums.append(float(maximum))

        if maximums:
            return max(maximums)

    return None


def _is_realistic_income_gap(
    scheme: Dict[str, Any],
    profile: Dict[str, Any],
) -> bool:
    """
    Prevent Benefit Gap from recommending income-based schemes
    when the user's current income is far beyond the scheme's
    income ceiling.

    A gap is considered potentially actionable only when the
    user's income is no more than 2x the highest applicable
    income threshold.

    Example:
        ₹4L vs ₹3L  -> allowed
        ₹5.5L vs ₹3L -> allowed
        ₹10L+ vs ₹3L -> rejected
    """

    eligibility = scheme.get("eligibility", {})

    requirement = eligibility.get("annual_income")

    maximum_income = _income_requirement_maximum(
        requirement
    )

    if maximum_income is None:
        return True

    current_income = profile.get("annual_income")

    if not isinstance(current_income, (int, float)):
        return False

    if current_income <= maximum_income:
        return True

    return current_income <= (
        maximum_income * 2
    )


# ============================================================
# REALISTIC GAP GATE
# ============================================================

def _is_realistic_gap(
    scheme: Dict[str, Any],
    profile: Dict[str, Any],
) -> bool:
    """
    Reject schemes where the user is fundamentally incompatible,
    even if the matcher reports a high percentage match.
    """

    eligibility = scheme.get("eligibility", {})

    # --------------------------------------------------------
    # Social category
    # A person cannot simply "unlock" SC/ST/minority eligibility.
    # --------------------------------------------------------

    required_category = eligibility.get("social_category")

    if required_category:
        user_category = profile.get("social_category")

        if not user_category:
            return False

        required_values = (
            required_category
            if isinstance(required_category, list)
            else [required_category]
        )

        user_value = str(user_category).lower()

        if not any(
            user_value == str(value).lower()
            for value in required_values
        ):
            return False

    # --------------------------------------------------------
    # Disability
    # --------------------------------------------------------

    required_disability = eligibility.get(
        "disability_status"
    )

    if required_disability is True:
        if profile.get("disability_status") is not True:
            return False

    # --------------------------------------------------------
    # Income
    # --------------------------------------------------------

    if not _is_realistic_income_gap(
        scheme,
        profile,
    ):
        return False

    # --------------------------------------------------------
    # EDUCATION LEVEL
    # Reject schemes meant for a LOWER education level.
    # --------------------------------------------------------

    education_order = {
        "class_9": 1,
        "class_10": 2,
        "class_11": 3,
        "class_12": 4,
        "undergraduate": 5,
        "postgraduate": 6,
        "master_degree": 6,
        "phd": 7,
    }

    required_education = eligibility.get(
        "education_level"
    )

    user_education = profile.get(
        "education_level"
    )

    if required_education and user_education:

        required_values = (
            required_education
            if isinstance(required_education, list)
            else [required_education]
        )

        user_values = (
            user_education
            if isinstance(user_education, list)
            else [user_education]
        )

        user_levels = [
            education_order.get(
                str(value).lower()
            )
            for value in user_values
        ]

        user_levels = [
            level
            for level in user_levels
            if level is not None
        ]

        required_levels = [
            education_order.get(
                str(value).lower()
            )
            for value in required_values
        ]

        required_levels = [
            level
            for level in required_levels
            if level is not None
        ]

        # User is already beyond the scheme's education level.
        if user_levels and required_levels:
            if min(user_levels) > max(
                required_levels
            ):
                return False

    # --------------------------------------------------------
    # First-year PG requirement
    # --------------------------------------------------------

    age_rule = eligibility.get(
        "age",
        {}
    )

    other_conditions = eligibility.get(
        "other_conditions",
        []
    )

    requirement_text = " ".join(
        [
            str(
                age_rule.get(
                    "original_text",
                    ""
                )
            ),
            str(
                eligibility.get(
                    "original_eligibility_text",
                    ""
                )
            ),
            " ".join(
                str(x)
                for x in other_conditions
            ),
        ]
    ).lower()

    if (
        profile.get(
            "is_first_year_pg"
        ) is False
        and (
            "first year" in requirement_text
            or "first-year" in requirement_text
        )
        and (
            "pg" in requirement_text
            or "master" in requirement_text
            or "postgraduate" in requirement_text
        )
    ):
        return False

    return True


# ============================================================
# RELEVANCE GATE
# ============================================================

def _passes_relevance_gate(
    scheme: Dict[str, Any],
    profile: Dict[str, Any],
) -> bool:
    """
    Reject schemes intended for a fundamentally different
    beneficiary group.
    """

    eligibility = scheme.get(
        "eligibility",
        {}
    )

    # --------------------------------------------------------
    # Occupation mismatch
    # --------------------------------------------------------

    required_occupation = eligibility.get(
        "occupation"
    )

    user_occupation = profile.get(
        "occupation"
    )

    if required_occupation and user_occupation:

        required_values = (
            required_occupation
            if isinstance(required_occupation, list)
            else [required_occupation]
        )

        user_value = str(
            user_occupation
        ).lower()

        occupation_match = any(
            user_value == str(
                value
            ).lower()
            or user_value in str(
                value
            ).lower()
            or str(
                value
            ).lower() in user_value
            for value in required_values
        )

        if not occupation_match:
            return False

    # --------------------------------------------------------
    # User type mismatch
    # --------------------------------------------------------

    required_user_type = eligibility.get(
        "user_type"
    )

    user_type = profile.get(
        "user_type"
    )

    if required_user_type and user_type:

        required_values = (
            required_user_type
            if isinstance(required_user_type, list)
            else [required_user_type]
        )

        user_values = (
            user_type
            if isinstance(user_type, list)
            else [user_type]
        )

        user_type_match = any(
            str(user_val).lower()
            == str(req_val).lower()
            or str(user_val).lower()
            in str(req_val).lower()
            or str(req_val).lower()
            in str(user_val).lower()
            for user_val in user_values
            for req_val in required_values
        )

        if not user_type_match:
            return False

    # --------------------------------------------------------
    # Disability-specific schemes
    # --------------------------------------------------------

    required_disability = eligibility.get(
        "disability_status"
    )

    user_disability = profile.get(
        "disability_status"
    )

    if (
        required_disability is True
        and user_disability is False
    ):
        return False

    return True


# ============================================================
# MAIN ANALYSIS
# ============================================================

def analyze_benefit_gaps(
    profile: Dict[str, Any],
    top_k: int = 5,
) -> List[Dict[str, Any]]:
    """
    Identify realistic Benefit Gap opportunities.
    """

    schemes = load_schemes()

    gaps: List[Dict[str, Any]] = []

    for scheme in schemes:

        # ----------------------------------------------------
        # Realistic-profile gate
        # ----------------------------------------------------

        if not _is_realistic_gap(
            scheme,
            profile,
        ):
            continue

        # ----------------------------------------------------
        # Relevance gate
        # ----------------------------------------------------

        if not _passes_relevance_gate(
            scheme,
            profile,
        ):
            continue

        # ----------------------------------------------------
        # Use existing matcher
        # ----------------------------------------------------

        eligibility_result = check_eligibility(
            scheme,
            profile,
        )

        status = eligibility_result.get(
            "status"
        )

        if status == "eligible":
            continue

        failed_conditions = eligibility_result.get(
            "failed_conditions",
            [],
        )

        if not failed_conditions:
            continue

        # ----------------------------------------------------
        # Classify blockers
        # ----------------------------------------------------

        blockers: List[Dict[str, Any]] = []

        hard_blocked = False

        for condition in failed_conditions:

            field = _extract_field_from_condition(
                condition
            )

            if not field:
                continue

            if _violates_profile_specific_condition(
                field,
                condition,
                profile,
            ):
                continue

            if _is_hard_blocker(field):
                hard_blocked = True
                break

            if _is_ignored(field):
                continue

            if not _is_actionable(field):
                continue

            if not _has_meaningful_requirement(
                scheme,
                field,
            ):
                continue

            # ------------------------------------------------
            # Income-specific realism
            # ------------------------------------------------

            if field == "annual_income":
                if not _is_realistic_income_gap(
                    scheme,
                    profile,
                ):
                    continue

            # ------------------------------------------------
            # Occupation
            # ------------------------------------------------

            if field == "occupation":

                requirement = scheme.get(
                    "eligibility",
                    {},
                ).get(
                    "occupation",
                    [],
                )

                if not isinstance(
                    requirement,
                    list,
                ):
                    continue

                if not requirement:
                    continue

            blockers.append({
                "field": field,
                "condition": condition,
                "reason": condition,
                "requirement": _format_requirement(
                    scheme.get(
                        "eligibility",
                        {},
                    ).get(field)
                ),
                "unlock_explanation":
                    _build_unlock_explanation(
                        field,
                        scheme,
                    ),
                "priority":
                    _blocker_priority(
                        field
                    ),
            })

        # ----------------------------------------------------
        # Hard compatibility blocker
        # ----------------------------------------------------

        if hard_blocked:
            continue

        # ----------------------------------------------------
        # No actionable blocker
        # ----------------------------------------------------

        if not blockers:
            continue

        # ----------------------------------------------------
        # Remove duplicate fields
        # ----------------------------------------------------

        unique_blockers = {}

        for blocker in blockers:

            field = blocker[
                "field"
            ]

            if field not in unique_blockers:
                unique_blockers[field] = blocker

        blockers = list(
            unique_blockers.values()
        )

        # ----------------------------------------------------
        # Too many blockers
        # ----------------------------------------------------

        if len(blockers) > 3:
            continue

        # ----------------------------------------------------
        # Proximity
        # ----------------------------------------------------

        proximity_percentage = _calculate_proximity(
            eligibility_result
        )

        if proximity_percentage < 50:
            continue

        # ----------------------------------------------------
        # Benefit
        # ----------------------------------------------------

        benefit_amount = _benefit_value(
            scheme
        )

        # ----------------------------------------------------
        # Build result
        # ----------------------------------------------------

        gaps.append({
            "scheme_id":
                scheme.get(
                    "scheme_id"
                ),

            "scheme_name":
                scheme.get(
                    "scheme_name"
                ),

            "category":
                scheme.get(
                    "category"
                ),

            "benefit":
                scheme.get(
                    "benefit",
                    {},
                ),

            "benefit_amount":
                benefit_amount,

            "current_status":
                status,

            "proximity_percentage":
                proximity_percentage,

            "match_percentage":
                eligibility_result.get(
                    "match_percentage",
                    0,
                ),

            "blocker_count":
                len(blockers),

            "blockers":
                blockers,

            "failed_conditions":
                failed_conditions,

            "missing_information":
                eligibility_result.get(
                    "missing_information",
                    [],
                ),

            "required_documents":
                scheme.get(
                    "required_documents",
                    [],
                ),

            "optional_documents":
                scheme.get(
                    "optional_documents",
                    [],
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
                    False,
                ),

            "manual_verification_reason":
                scheme.get(
                    "manual_verification_reason"
                ),
        })

    # ========================================================
    # RANK RESULTS
    # ========================================================

    gaps.sort(
        key=lambda item: (
            -item[
                "proximity_percentage"
            ],
            item[
                "blocker_count"
            ],
            min(
                (
                    _blocker_priority(
                        blocker[
                            "field"
                        ]
                    )
                    for blocker
                    in item[
                        "blockers"
                    ]
                ),
                default=99,
            ),
            -(
                item[
                    "benefit_amount"
                ]
                or 0
            ),
            item[
                "scheme_name"
            ] or "",
        )
    )

    return gaps[:top_k]