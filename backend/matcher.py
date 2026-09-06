import json
import os
from typing import Any, Dict, List, Optional


# --------------------------------------------------
# LOAD DATASET
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "data", "schemes.json")


def load_schemes() -> List[Dict[str, Any]]:
    """
    Loads schemes from schemes.json.
    Supports either:
    1. A direct list of schemes
    2. A dictionary containing a 'schemes' list
    """

    with open(DATASET_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)

    if isinstance(data, list):
        return data

    if isinstance(data, dict):
        if isinstance(data.get("schemes"), list):
            return data["schemes"]

    raise ValueError(
        "Invalid schemes.json format. Expected a list of schemes "
        "or a dictionary containing a 'schemes' list."
    )


# --------------------------------------------------
# BASIC HELPERS
# --------------------------------------------------

def normalize(value: Any) -> str:
    """
    Converts values into a comparable lowercase string.
    """

    if value is None:
        return ""

    return str(value).strip().lower()


def is_missing(value: Any) -> bool:
    """
    Checks whether a user has not provided a value.
    """

    return value is None or value == ""


def contains_wildcard(values: Any) -> bool:
    """
    Handles dataset values such as:
    - Open to all occupations
    - Open to all
    - All occupations
    - Any
    - No restriction
    """

    if not isinstance(values, list):
        values = [values]

    wildcard_phrases = [
        "open to all",
        "open to all occupations",
        "all occupations",
        "all",
        "any",
        "no restriction",
        "not restricted",
        "unrestricted",
    ]

    for value in values:
        value = normalize(value)

        for phrase in wildcard_phrases:
            if phrase in value:
                return True

    return False


def value_matches(user_value: Any, allowed_values: Any) -> bool:
    """
    Checks whether a user's value matches the allowed dataset values.
    """

    if contains_wildcard(allowed_values):
        return True

    if not isinstance(allowed_values, list):
        allowed_values = [allowed_values]

    user_value = normalize(user_value)

    for allowed_value in allowed_values:
        allowed_value = normalize(allowed_value)

        if user_value == allowed_value:
            return True

        # Allows simple partial matching for phrases such as:
        # 'student' and 'students'
        if user_value and (
            user_value in allowed_value
            or allowed_value in user_value
        ):
            return True

    return False


def format_condition(field: str, message: str) -> str:
    """
    Creates a readable explanation for the frontend.
    """

    field_names = {
        "age": "Age",
        "state": "State",
        "occupation": "Occupation",
        "education_level": "Education level",
        "annual_income": "Annual income",
        "social_category": "Social category",
        "gender": "Gender",
        "disability_status": "Disability status",
        "disability_percentage": "Disability percentage",
        "employment_status": "Employment status",
        "user_type": "User type",
    }

    readable_field = field_names.get(field, field.replace("_", " ").title())

    return f"{readable_field}: {message}"


# --------------------------------------------------
# AGE CHECK
# --------------------------------------------------

def check_age(
    user_age: Any,
    age_rule: Any
) -> Optional[bool]:
    """
    Returns:
    True  -> age matches
    False -> age definitely fails
    None  -> age information is missing or rule is unavailable
    """

    if not age_rule:
        return True

    if is_missing(user_age):
        return None

    try:
        user_age = float(user_age)
    except (TypeError, ValueError):
        return None

    if isinstance(age_rule, dict):
        minimum = age_rule.get("min")
        maximum = age_rule.get("max")

        if minimum is not None and user_age < float(minimum):
            return False

        if maximum is not None and user_age > float(maximum):
            return False

        return True

    return True


# --------------------------------------------------
# INCOME CHECK
# --------------------------------------------------

def check_income(
    user_income: Any,
    income_rule: Any
) -> Optional[bool]:
    """
    Returns:
    True  -> income matches
    False -> income definitely fails
    None  -> income is missing
    """

    if not income_rule:
        return True

    if is_missing(user_income):
        return None

    try:
        user_income = float(user_income)
    except (TypeError, ValueError):
        return None

    if isinstance(income_rule, dict):
        minimum = income_rule.get("min")
        maximum = income_rule.get("max")

        if minimum is not None and user_income < float(minimum):
            return False

        if maximum is not None and user_income > float(maximum):
            return False

        return True

    return True


# --------------------------------------------------
# MAIN ELIGIBILITY CHECK
# --------------------------------------------------

def check_eligibility(
    scheme: Dict[str, Any],
    user_profile: Dict[str, Any]
) -> Dict[str, Any]:

    eligibility_rules = scheme.get("eligibility", {})

    matched_conditions = []
    failed_conditions = []
    missing_information = []

    # These fields are checked against the user's basic profile.
    profile_fields = [
        "state",
        "district",
        "occupation",
        "education_level",
        "course_type",
        "institution_type",
        "social_category",
        "gender",
        "disability_status",
        "employment_status",
        "user_type",
    ]

    # ----------------------------------------------
    # AGE
    # ----------------------------------------------

    if "age" in eligibility_rules:
        age_result = check_age(
            user_profile.get("age"),
            eligibility_rules.get("age")
        )

        if age_result is True:
            matched_conditions.append(
                format_condition("age", "requirement satisfied")
            )

        elif age_result is False:
            failed_conditions.append(
                format_condition("age", "requirement not satisfied")
            )

        else:
            missing_information.append(
                format_condition("age", "required")
            )

    # ----------------------------------------------
    # INCOME
    # ----------------------------------------------

    if "annual_income" in eligibility_rules:
        income_result = check_income(
            user_profile.get("annual_income"),
            eligibility_rules.get("annual_income")
        )

        if income_result is True:
            matched_conditions.append(
                format_condition("annual_income", "requirement satisfied")
            )

        elif income_result is False:
            failed_conditions.append(
                format_condition("annual_income", "requirement not satisfied")
            )

        else:
            missing_information.append(
                format_condition("annual_income", "required")
            )

    # ----------------------------------------------
    # OTHER PROFILE FIELDS
    # ----------------------------------------------

    for field in profile_fields:

        if field not in eligibility_rules:
            continue

        allowed_values = eligibility_rules.get(field)
        user_value = user_profile.get(field)

        # No restriction
        # Empty eligibility list means there is no restriction
        if allowed_values == [] or allowed_values is None:
            matched_conditions.append(
                format_condition(field, "no restriction")
            )
            continue

        if contains_wildcard(allowed_values):
            matched_conditions.append(
                format_condition(field, "no restriction")
            )
            continue

        if is_missing(user_value):
            missing_information.append(
                format_condition(field, "required")
            )
            continue

        # User's value does not match the scheme
        if value_matches(user_value, allowed_values):
            matched_conditions.append(
                format_condition(field, "requirement satisfied")
            )
        else:
            failed_conditions.append(
                format_condition(field, "requirement not satisfied")
            )

    # ----------------------------------------------
    # DETERMINE STATUS
    # ----------------------------------------------

    if failed_conditions:
        status = "not_eligible"

    elif missing_information:
        status = "possibly_eligible"

    else:
        status = "eligible"

    # ----------------------------------------------
    # MATCH PERCENTAGE
    # ----------------------------------------------

    total_conditions = (
        len(matched_conditions)
        + len(failed_conditions)
        + len(missing_information)
    )

    if total_conditions == 0:
        match_percentage = 0
    else:
        match_percentage = round(
            len(matched_conditions) / total_conditions * 100
        )

    # ----------------------------------------------
    # USER-FRIENDLY SUMMARY
    # ----------------------------------------------

    if status == "eligible":
        eligibility_summary = (
            "You satisfy all the known eligibility conditions "
            "for this scheme."
        )

    elif status == "possibly_eligible":
        eligibility_summary = (
            "You may be eligible. Provide the missing information "
            "to confirm your eligibility."
        )

    else:
        eligibility_summary = (
            "You do not currently satisfy one or more mandatory "
            "eligibility conditions for this scheme."
        )

    return {
        "status": status,
        "match_percentage": match_percentage,
        "eligibility_summary": eligibility_summary,
        "matched_conditions": matched_conditions,
        "failed_conditions": failed_conditions,
        "missing_information": missing_information,
    }

# --------------------------------------------------
# DOCUMENT READINESS
# --------------------------------------------------

def calculate_document_readiness(
    required_documents: List[str],
    available_documents: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Calculates how many required documents the user currently has.

    Documents are not collected during sign-in.
    Therefore, readiness is 0 until the user provides documents.
    """

    if available_documents is None:
        available_documents = []

    available_normalized = {
        normalize(document)
        for document in available_documents
    }

    matched_documents = []
    missing_documents = []

    for document in required_documents:
        if normalize(document) in available_normalized:
            matched_documents.append(document)
        else:
            missing_documents.append(document)

    total_documents = len(required_documents)

    if total_documents == 0:
        readiness_percentage = 100
    else:
        readiness_percentage = round(
            len(matched_documents) / total_documents * 100
        )

    return {
        "total_required_documents": total_documents,
        "available_documents": matched_documents,
        "missing_documents": missing_documents,
        "readiness_percentage": readiness_percentage
    }

# --------------------------------------------------
# RECOMMENDATION ENGINE
# --------------------------------------------------

def recommend_schemes(
    user_profile: Dict[str, Any]
) -> List[Dict[str, Any]]:

    schemes = load_schemes()
    recommendations = []

    for scheme in schemes:

        eligibility_result = check_eligibility(
            scheme,
            user_profile
        )

        document_readiness = calculate_document_readiness(
            scheme.get("required_documents", [])
        )
        # Do not recommend schemes where a mandatory
        # condition definitely fails.
        if eligibility_result["status"] == "not_eligible":
            continue

        recommendation = {
            "scheme_id": scheme.get("scheme_id"),
            "scheme_name": scheme.get("scheme_name"),
            "category": scheme.get("category"),

            "benefit": scheme.get("benefit", {}),

            "required_documents": scheme.get(
                "required_documents",
                []
            ),

            "optional_documents": scheme.get(
                "optional_documents",
                []
            ),

            "application_steps": scheme.get(
                "application_steps",
                []
            ),

            "official_portal": scheme.get(
                "official_portal"
            ),

            "source_url": scheme.get(
                "source_url"
            ),

            "status": eligibility_result["status"],
            "match_percentage": eligibility_result[
                "match_percentage"
            ],

            "eligibility_summary": eligibility_result[
                "eligibility_summary"
            ],

            "matched_conditions": eligibility_result[
                "matched_conditions"
            ],

            "failed_conditions": eligibility_result[
                "failed_conditions"
            ],

            "missing_information": eligibility_result[
                "missing_information"
            ],
            "additional_conditions": scheme.get(
                "eligibility", {}
            ).get("other_conditions", []),

            "manual_verification_required": scheme.get(
                "manual_verification_required",
                False
            ),

            "manual_verification_reason": scheme.get(
                "manual_verification_reason",
                ""
            ),

            "document_readiness": document_readiness,
        }

        recommendations.append(recommendation)

    # Fully eligible schemes first.
    # Then possibly eligible schemes with the highest percentage.
    recommendations.sort(
        key=lambda scheme: (
            0 if scheme["status"] == "eligible" else 1,
            -scheme["match_percentage"]
        )
    )

    return recommendations


# --------------------------------------------------
# LOCAL TEST
# --------------------------------------------------

if __name__ == "__main__":

    sample_user = {
        "age": 25,
        "state": "Jharkhand",
        "district": "Ranchi",
        "occupation": "construction worker",
        "education_level": "undergraduate",
        "course_type": None,
        "institution_type": None,
        "annual_income": None,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "employed",
        "user_type": "construction_worker"
    }

    recommendations = recommend_schemes(sample_user)

    print(f"Total recommendations: {len(recommendations)}")

    for scheme in recommendations:
        print("\n-----------------------------------")
        print("Scheme:", scheme["scheme_name"])
        print("Category:", scheme["category"])
        print("Status:", scheme["status"])
        print("Match percentage:", scheme["match_percentage"])
        print("Summary:", scheme["eligibility_summary"])

        print("Matched conditions:")
        for condition in scheme["matched_conditions"]:
            print(" -", condition)

        print("Missing information:")
        for condition in scheme["missing_information"]:
            print(" -", condition)

        print("Failed conditions:")
        for condition in scheme["failed_conditions"]:
            print(" -", condition)

        print("Additional conditions:")
        for condition in scheme["additional_conditions"]:
            print(" -", condition)

        print("Manual verification required:",
            scheme["manual_verification_required"])

        print("Manual verification reason:",
            scheme["manual_verification_reason"])