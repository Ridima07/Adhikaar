import json
import os
from typing import Any, Dict, List, Optional


# ==================================================
# LOAD DATASET
# ==================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "data", "schemes.json")


def load_schemes() -> List[Dict[str, Any]]:
    """
    Loads schemes from schemes.json.

    Supported formats:
    1. Direct list of schemes
    2. Dictionary containing a 'schemes' list
    """

    with open(DATASET_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)

    if isinstance(data, list):
        return data

    if isinstance(data, dict) and isinstance(data.get("schemes"), list):
        return data["schemes"]

    raise ValueError(
        "Invalid schemes.json format. Expected a list of schemes "
        "or a dictionary containing a 'schemes' list."
    )


# ==================================================
# BASIC HELPERS
# ==================================================

def normalize(value: Any) -> str:
    """
    Converts a value into a lowercase comparable string.
    """

    if value is None:
        return ""

    return str(value).strip().lower()


def is_missing(value: Any) -> bool:
    """
    Checks whether a user has not provided a value.

    Empty lists are also treated as missing.
    """

    if value is None:
        return True

    if isinstance(value, str) and value.strip() == "":
        return True

    if isinstance(value, list) and len(value) == 0:
        return True

    return False


def to_list(value: Any) -> List[Any]:
    """
    Converts a value into a list.

    Examples:
        "student" -> ["student"]
        ["student", "researcher"] -> ["student", "researcher"]
        None -> []
    """

    if value is None:
        return []

    if isinstance(value, list):
        return value

    return [value]


def contains_wildcard(values: Any) -> bool:
    """
    Checks whether the scheme has a value meaning
    there is no restriction.

    Examples:
        Open to all
        Open to all occupations
        All occupations
        Any
        No restriction
    """

    values = to_list(values)

    wildcard_phrases = [
        "open to all",
        "open to all occupations",
        "all occupations",
        "all",
        "any",
        "no restriction",
        "not restricted",
        "unrestricted",
        "no income limit",
        "no restriction on",
    ]

    for value in values:
        value = normalize(value)

        for phrase in wildcard_phrases:
            if phrase in value:
                return True

    return False


def value_matches(
    user_value: Any,
    allowed_values: Any
) -> bool:
    """
    Checks whether the user's value matches one or more
    allowed scheme values.

    Supports:
    - Strings
    - Lists
    - Case-insensitive matching
    - Simple singular/plural matching
    - Multiple user values
    """

    if contains_wildcard(allowed_values):
        return True

    user_values = to_list(user_value)
    allowed_values = to_list(allowed_values)

    user_values = [
        normalize(value)
        for value in user_values
        if not is_missing(value)
    ]

    allowed_values = [
        normalize(value)
        for value in allowed_values
        if not is_missing(value)
    ]

    if not user_values or not allowed_values:
        return False

    for user_item in user_values:

        for allowed_item in allowed_values:

            # Exact match
            if user_item == allowed_item:
                return True

            # Simple singular/plural or phrase matching
            if (
                user_item in allowed_item
                or allowed_item in user_item
            ):
                return True

    return False


def normalize_boolean(value: Any) -> Optional[bool]:
    """
    Converts common boolean representations into True/False.

    Examples:
        True, "yes", "y", "true" -> True
        False, "no", "n", "false" -> False
        None -> None
    """

    if value is None:
        return None

    if isinstance(value, bool):
        return value

    value = normalize(value)

    if value in ["true", "yes", "y", "1"]:
        return True

    if value in ["false", "no", "n", "0"]:
        return False

    return None


def format_condition(
    field: str,
    message: str
) -> str:
    """
    Converts technical field names into readable text.
    """

    field_names = {
        "age": "Age",
        "state": "State",
        "district": "District",
        "occupation": "Occupation",
        "education_level": "Education level",
        "course_type": "Course type",
        "institution_type": "Institution type",
        "annual_income": "Annual income",
        "social_category": "Social category",
        "gender": "Gender",
        "disability_status": "Disability status",
        "disability_percentage": "Disability percentage",
        "employment_status": "Employment status",
        "user_type": "User type",
        "is_single_girl_child": "Single girl child status",
    }

    readable_field = field_names.get(
        field,
        field.replace("_", " ").title()
    )

    return f"{readable_field}: {message}"


# ==================================================
# AGE CHECK
# ==================================================

def check_age(
    user_age: Any,
    age_rule: Any
) -> Optional[bool]:
    """
    Returns:

    True:
        Age satisfies the rule.

    False:
        Age definitely fails the rule.

    None:
        User age is missing or invalid.
    """

    # No age rule means no restriction
    if not age_rule:
        return True

    if is_missing(user_age):
        return None

    try:
        user_age = float(user_age)
    except (TypeError, ValueError):
        return None

    if not isinstance(age_rule, dict):
        return True

    minimum = age_rule.get("min")
    maximum = age_rule.get("max")

    if minimum is not None:
        if user_age < float(minimum):
            return False

    if maximum is not None:
        if user_age > float(maximum):
            return False

    return True


# ==================================================
# INCOME CHECK
# ==================================================

def check_income(
    user_income: Any,
    income_rule: Any
) -> Optional[bool]:
    """
    Returns:

    True:
        Income satisfies the rule.

    False:
        Income definitely fails the rule.

    None:
        User income is missing or invalid.
    """

    # No income rule means no restriction
    if not income_rule:
        return True

    if not isinstance(income_rule, dict):
        return True

    minimum = income_rule.get("min")
    maximum = income_rule.get("max")

    # A scheme explicitly says there is no income limit
    original_text = normalize(
        income_rule.get("original_text")
    )

    if (
        "no income limit" in original_text
        or "no restriction" in original_text
    ):
        return True

    # If there is no actual numerical limit,
    # do not force the user to provide income.
    if minimum is None and maximum is None:
        return True

    if is_missing(user_income):
        return None

    try:
        user_income = float(user_income)
    except (TypeError, ValueError):
        return None

    if minimum is not None:
        if user_income < float(minimum):
            return False

    if maximum is not None:
        if user_income > float(maximum):
            return False

    return True


# ==================================================
# DISABILITY CHECK
# ==================================================

def check_disability_status(
    user_status: Any,
    scheme_status: Any
) -> Optional[bool]:
    """
    Checks disability status.

    Examples:
        Scheme requires disabled person.
        User has disability_status = "yes".

        Scheme has no disability restriction.
        Returns True.
    """

    # No restriction
    if scheme_status is None:
        return True

    user_status = normalize_boolean(user_status)
    required_status = normalize_boolean(scheme_status)

    if required_status is None:
        return True

    if user_status is None:
        return None

    return user_status == required_status


# ==================================================
# DISABILITY PERCENTAGE CHECK
# ==================================================

def check_disability_percentage(
    user_percentage: Any,
    percentage_rule: Any
) -> Optional[bool]:
    """
    Checks minimum and maximum disability percentage.
    """

    if not percentage_rule:
        return True

    if not isinstance(percentage_rule, dict):
        return True

    minimum = percentage_rule.get("min")
    maximum = percentage_rule.get("max")

    if minimum is None and maximum is None:
        return True

    if is_missing(user_percentage):
        return None

    try:
        user_percentage = float(user_percentage)
    except (TypeError, ValueError):
        return None

    if minimum is not None:
        if user_percentage < float(minimum):
            return False

    if maximum is not None:
        if user_percentage > float(maximum):
            return False

    return True


# ==================================================
# SPECIAL CONDITION CHECKS
# ==================================================

def check_single_girl_child(
    user_profile: Dict[str, Any],
    scheme: Dict[str, Any]
) -> Optional[bool]:
    """
    Checks whether the user is a single girl child
    when the scheme requires it.

    The scheme may represent this condition through:
    - user_type
    - is_single_girl_child
    - other_conditions
    """

    eligibility_rules = scheme.get("eligibility", {})

    scheme_user_types = eligibility_rules.get("user_type", [])

    other_conditions = eligibility_rules.get(
        "other_conditions",
        []
    )

    condition_text = " ".join(
        normalize(condition)
        for condition in other_conditions
    )

    requires_single_girl = (
        "single girl" in condition_text
        or "only child" in condition_text
        or value_matches(
            "single_girl_child",
            scheme_user_types
        )
    )

    if not requires_single_girl:
        return True

    user_value = user_profile.get("is_single_girl_child")

    if is_missing(user_value):
        user_types = user_profile.get("user_type", [])

        if value_matches(
            "single_girl_child",
            user_types
        ):
            return True

        return None

    normalized_value = normalize_boolean(user_value)

    if normalized_value is None:
        return None

    return normalized_value


# ==================================================
# MAIN ELIGIBILITY CHECK
# ==================================================

def check_eligibility(
    scheme: Dict[str, Any],
    user_profile: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Main eligibility engine.

    IMPORTANT:
    The argument order is:

        check_eligibility(scheme, user_profile)

    The function returns:
    - eligible
    - possibly_eligible
    - not_eligible
    """

    eligibility_rules = scheme.get(
        "eligibility",
        {}
    )

    matched_conditions = []
    failed_conditions = []
    missing_information = []

    # These fields are directly compared with
    # the user's profile.
    profile_fields = [
        "state",
        "district",
        "occupation",
        "education_level",
        "course_type",
        "institution_type",
        "social_category",
        "gender",
        "employment_status",
        "user_type",
    ]

    # ==================================================
    # AGE
    # ==================================================

    if "age" in eligibility_rules:

        age_result = check_age(
            user_profile.get("age"),
            eligibility_rules.get("age")
        )

        if age_result is True:

            matched_conditions.append(
                format_condition(
                    "age",
                    "requirement satisfied"
                )
            )

        elif age_result is False:

            failed_conditions.append(
                format_condition(
                    "age",
                    "requirement not satisfied"
                )
            )

        else:

            missing_information.append(
                format_condition(
                    "age",
                    "required"
                )
            )

    # ==================================================
    # ANNUAL INCOME
    # ==================================================

    if "annual_income" in eligibility_rules:

        income_result = check_income(
            user_profile.get("annual_income"),
            eligibility_rules.get("annual_income")
        )

        if income_result is True:

            matched_conditions.append(
                format_condition(
                    "annual_income",
                    "requirement satisfied"
                )
            )

        elif income_result is False:

            failed_conditions.append(
                format_condition(
                    "annual_income",
                    "requirement not satisfied"
                )
            )

        else:

            missing_information.append(
                format_condition(
                    "annual_income",
                    "required"
                )
            )

    # ==================================================
    # DISABILITY STATUS
    # ==================================================

    if "disability_status" in eligibility_rules:

        disability_rule = eligibility_rules.get(
            "disability_status"
        )

        disability_result = check_disability_status(
            user_profile.get("disability_status"),
            disability_rule
        )

        if disability_result is True:

            matched_conditions.append(
                format_condition(
                    "disability_status",
                    "requirement satisfied"
                )
            )

        elif disability_result is False:

            failed_conditions.append(
                format_condition(
                    "disability_status",
                    "requirement not satisfied"
                )
            )

        else:

            missing_information.append(
                format_condition(
                    "disability_status",
                    "required"
                )
            )

    # ==================================================
    # DISABILITY PERCENTAGE
    # ==================================================

    if "disability_percentage" in eligibility_rules:

        percentage_result = check_disability_percentage(
            user_profile.get("disability_percentage"),
            eligibility_rules.get("disability_percentage")
        )

        if percentage_result is True:

            matched_conditions.append(
                format_condition(
                    "disability_percentage",
                    "requirement satisfied"
                )
            )

        elif percentage_result is False:

            failed_conditions.append(
                format_condition(
                    "disability_percentage",
                    "requirement not satisfied"
                )
            )

        else:

            missing_information.append(
                format_condition(
                    "disability_percentage",
                    "required"
                )
            )

    # ==================================================
    # OTHER PROFILE FIELDS
    # ==================================================

    for field in profile_fields:

        if field not in eligibility_rules:
            continue

        allowed_values = eligibility_rules.get(field)
        user_value = user_profile.get(field)

        # Empty list or null means no restriction
        if allowed_values == [] or allowed_values is None:

            matched_conditions.append(
                format_condition(
                    field,
                    "no restriction"
                )
            )

            continue

        # Explicit wildcard means no restriction
        if contains_wildcard(allowed_values):

            matched_conditions.append(
                format_condition(
                    field,
                    "no restriction"
                )
            )

            continue

        # User has not supplied this field
        if is_missing(user_value):

            missing_information.append(
                format_condition(
                    field,
                    "required"
                )
            )

            continue

        # Compare user value with scheme values
        if value_matches(
            user_value,
            allowed_values
        ):

            matched_conditions.append(
                format_condition(
                    field,
                    "requirement satisfied"
                )
            )

        else:

            failed_conditions.append(
                format_condition(
                    field,
                    "requirement not satisfied"
                )
            )

    # ==================================================
    # SINGLE GIRL CHILD CONDITION
    # ==================================================

    single_girl_result = check_single_girl_child(
        user_profile,
        scheme
    )

    if single_girl_result is True:

        # Add this condition only if the scheme
        # actually requires it.
        scheme_text = normalize(
            " ".join(
                eligibility_rules.get(
                    "user_type",
                    []
                )
                if isinstance(
                    eligibility_rules.get("user_type", []),
                    list
                )
                else [
                    eligibility_rules.get("user_type", "")
                ]
            )
        )

        other_conditions_text = normalize(
            " ".join(
                eligibility_rules.get(
                    "other_conditions",
                    []
                )
            )
        )

        if (
            "single girl" in scheme_text
            or "single girl" in other_conditions_text
            or "only child" in other_conditions_text
        ):

            matched_conditions.append(
                format_condition(
                    "is_single_girl_child",
                    "requirement satisfied"
                )
            )

    elif single_girl_result is False:

        failed_conditions.append(
            format_condition(
                "is_single_girl_child",
                "requirement not satisfied"
            )
        )

    elif single_girl_result is None:

        missing_information.append(
            format_condition(
                "is_single_girl_child",
                "required"
            )
        )

    # ==================================================
    # DETERMINE STATUS
    # ==================================================

    if failed_conditions:

        status = "not_eligible"

    elif missing_information:

        status = "possibly_eligible"

    else:

        status = "eligible"

    # ==================================================
    # MATCH PERCENTAGE
    # ==================================================

    total_conditions = (
        len(matched_conditions)
        + len(failed_conditions)
        + len(missing_information)
    )

    if total_conditions == 0:

        match_percentage = 0

    else:

        match_percentage = round(
            len(matched_conditions)
            / total_conditions
            * 100
        )

    # ==================================================
    # USER-FRIENDLY SUMMARY
    # ==================================================

    if status == "eligible":

        eligibility_summary = (
            "You satisfy all the known eligibility conditions "
            "for this scheme."
        )

        if scheme.get("manual_verification_required", False):

            eligibility_summary += (
                " Some conditions may still require "
                "official verification."
            )

    elif status == "possibly_eligible":

        eligibility_summary = (
            "You may be eligible. Provide the missing "
            "information to confirm your eligibility."
        )

    else:

        eligibility_summary = (
            "You do not currently satisfy one or more "
            "mandatory eligibility conditions for this scheme."
        )

    # ==================================================
    # RETURN RESULT
    # ==================================================

    return {
        "status": status,
        "match_percentage": match_percentage,
        "eligibility_summary": eligibility_summary,
        "matched_conditions": matched_conditions,
        "failed_conditions": failed_conditions,
        "missing_information": missing_information,
    }


# ==================================================
# DOCUMENT READINESS
# ==================================================

def calculate_document_readiness(
    required_documents: List[str],
    available_documents: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Calculates document readiness.

    If available_documents is not provided,
    readiness is initially 0%.
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
            len(matched_documents)
            / total_documents
            * 100
        )

    return {
        "total_required_documents": total_documents,
        "available_documents": matched_documents,
        "missing_documents": missing_documents,
        "readiness_percentage": readiness_percentage,
    }


# ==================================================
# RECOMMENDATION ENGINE
# ==================================================

def recommend_schemes(
    user_profile: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Returns all schemes for which the user is:
    - eligible
    - possibly eligible

    Schemes with definite failed conditions
    are excluded.
    """

    schemes = load_schemes()
    recommendations = []

    for scheme in schemes:

        eligibility_result = check_eligibility(
            scheme,
            user_profile
        )

        # Do not recommend schemes where
        # a mandatory condition definitely fails.
        if eligibility_result["status"] == "not_eligible":
            continue

        document_readiness = calculate_document_readiness(
            scheme.get("required_documents", []),
            user_profile.get("available_documents", [])
        )

        eligibility_rules = scheme.get(
            "eligibility",
            {}
        )

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

            "last_verified": scheme.get(
                "last_verified"
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

            "additional_conditions": eligibility_rules.get(
                "other_conditions",
                []
            ),

            "manual_verification_required": scheme.get(
                "manual_verification_required",
                False
            ),

            "manual_verification_reason": scheme.get(
                "manual_verification_reason",
                ""
            ),

            "beneficiary_level": scheme.get(
                "beneficiary_level",
                "individual"
            ),

            "document_readiness": document_readiness,
        }

        recommendations.append(recommendation)

    # Fully eligible schemes first.
    # Then possibly eligible schemes.
    recommendations.sort(
        key=lambda scheme: (
            0 if scheme["status"] == "eligible" else 1,
            -scheme["match_percentage"],
            scheme["scheme_name"] or ""
        )
    )

    return recommendations


# ==================================================
# LOCAL TEST
# ==================================================

if __name__ == "__main__":

    sample_user = {
        "profile_id": "TEST001",
        "age": 23,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "Student",
        "education_level": [
            "postgraduate",
            "master_degree"
        ],
        "course_type": [
            "regular",
            "non_professional"
        ],
        "institution_type": (
            "UGC recognized university or college"
        ),
        "annual_income": None,
        "social_category": None,
        "gender": "female",
        "disability_status": None,
        "employment_status": "student",
        "user_type": [
            "student",
            "single_girl_child"
        ],
        "is_single_girl_child": True,
        "available_documents": [],
    }

    schemes = load_schemes()

    target_scheme = next(
        scheme
        for scheme in schemes
        if scheme.get("scheme_id") == "EDU006"
    )

    result = check_eligibility(
        target_scheme,
        sample_user
    )

    print("\nPROFILE")
    print(json.dumps(
        sample_user,
        indent=2,
        ensure_ascii=False
    ))

    print("\nSCHEME")
    print(json.dumps(
        target_scheme,
        indent=2,
        ensure_ascii=False
    ))

    print("\nRESULT")
    print(json.dumps(
        result,
        indent=2,
        ensure_ascii=False
    ))

    print("\nRECOMMENDATIONS")

    recommendations = recommend_schemes(
        sample_user
    )

    print(
        f"Total recommendations: "
        f"{len(recommendations)}"
    )

    for recommendation in recommendations:

        print("\n-----------------------------------")

        print(
            "Scheme:",
            recommendation["scheme_name"]
        )

        print(
            "Category:",
            recommendation["category"]
        )

        print(
            "Status:",
            recommendation["status"]
        )

        print(
            "Match percentage:",
            recommendation["match_percentage"]
        )

        print(
            "Summary:",
            recommendation["eligibility_summary"]
        )

        print("Matched conditions:")

        for condition in recommendation[
            "matched_conditions"
        ]:

            print(" -", condition)

        print("Missing information:")

        for condition in recommendation[
            "missing_information"
        ]:

            print(" -", condition)

        print("Failed conditions:")

        for condition in recommendation[
            "failed_conditions"
        ]:

            print(" -", condition)

        print("Additional conditions:")

        for condition in recommendation[
            "additional_conditions"
        ]:

            print(" -", condition)

        print(
            "Manual verification required:",
            recommendation[
                "manual_verification_required"
            ]
        )

        print(
            "Manual verification reason:",
            recommendation[
                "manual_verification_reason"
            ]
        )