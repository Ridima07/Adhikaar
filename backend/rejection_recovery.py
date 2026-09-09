"""
Rejection Recovery for Adhikaar.

This module explains possible rejection-related issues using only
the information already present in schemes.json.

It does not claim to know the exact rejection reason unless the
user provides it.
"""

from __future__ import annotations

from typing import Any

from matcher import load_schemes


def normalize_text(value: Any) -> str:
    """
    Convert a value into normalized lowercase text.
    """
    if value is None:
        return ""

    return str(value).strip().lower()


def find_scheme(scheme_id: str, schemes: list[dict]) -> dict | None:
    """
    Find a scheme using its scheme_id.
    Matching is case-insensitive.
    """
    requested_id = normalize_text(scheme_id)

    for scheme in schemes:
        current_id = normalize_text(
            scheme.get("scheme_id", "")
        )

        if current_id == requested_id:
            return scheme

    return None


def text_contains_any(text: str, keywords: list[str]) -> bool:
    """
    Check whether any keyword appears in the given text.
    """
    normalized = normalize_text(text)

    return any(
        keyword in normalized
        for keyword in keywords
    )

def extract_rejection_sentence(
    rejection_message: str
) -> str:
    """
    Find the most relevant sentence from a rejection letter.

    This is a simple rule-based extraction step.
    It does not claim to understand the entire letter.
    """

    sentences = [
        sentence.strip()
        for sentence in rejection_message.replace("\n", " ").split(".")
        if sentence.strip()
    ]

    rejection_keywords = [
        "rejected",
        "rejection",
        "not accepted",
        "not eligible",
        "ineligible",
        "missing",
        "invalid",
        "incorrect",
        "incomplete",
        "failed",
        "denied",
        "not approved",
        "verification",
        "certificate",
        "document",
        "proof",
        "requirement"
    ]

    for sentence in sentences:
        if text_contains_any(
            sentence,
            rejection_keywords
        ):
            return sentence

    return rejection_message.strip()


def format_eligibility_conditions(
    eligibility: dict,
    keywords: list[str]
) -> list[str]:
    """
    Return meaningful eligibility conditions as separate items.

    Empty structured values are ignored.
    """

    relevant_conditions = []

    for field, value in eligibility.items():

        if field == "original_eligibility_text":
            continue

        if value is None or value == [] or value == "":
            continue

        if isinstance(value, dict):

            meaningful_values = [
                item
                for item in value.values()
                if item is not None and item != ""
            ]

            if not meaningful_values:
                continue

            # Prefer the original readable condition if available.
            original_text = value.get("original_text")

            if original_text:
                condition_text = str(original_text)
            else:
                condition_text = str(value)

        elif isinstance(value, list):

            for item in value:
                if item and text_contains_any(
                    str(item),
                    keywords
                ):
                    relevant_conditions.append(
                        str(item)
                    )

            continue

        else:
            condition_text = str(value)

        field_text = str(field).replace(
            "_",
            " "
        )

        combined_text = (
            f"{field_text}: {condition_text}"
        )

        if text_contains_any(
            combined_text,
            keywords
        ):
            relevant_conditions.append(
                combined_text
            )

    return relevant_conditions

def find_related_documents(
    required_documents: list[str],
    keywords: list[str]
) -> list[str]:
    """
    Find required documents related to a rejection category.
    """
    related_documents = []

    for document in required_documents:
        if text_contains_any(document, keywords):
            related_documents.append(document)

    return related_documents


def get_relevant_conditions(
    eligibility: dict,
    keywords: list[str]
) -> list[str]:
    """
    Return only meaningful eligibility conditions related
    to the supplied rejection category.
    """

    relevant_conditions = []

    for field, value in eligibility.items():

        if field == "original_eligibility_text":
            continue

        if value is None or value == [] or value == "":
            continue

        # Ignore empty structured eligibility values.
        if isinstance(value, dict):
            meaningful_values = [
                item
                for item in value.values()
                if item is not None and item != ""
            ]

            if not meaningful_values:
                continue

            value_text = str(value)

        else:
            value_text = str(value)

        field_text = str(field).replace("_", " ")

        combined_text = f"{field_text}: {value_text}"

        if text_contains_any(combined_text, keywords):
            relevant_conditions.append(combined_text)

    return relevant_conditions
    relevant_conditions = []

    for field, value in eligibility.items():

        if field == "original_eligibility_text":
            continue

        if value is None or value == [] or value == "":
            continue

        field_text = str(field).replace("_", " ")
        value_text = str(value)

        combined_text = f"{field_text}: {value_text}"

        if text_contains_any(combined_text, keywords):
            relevant_conditions.append(combined_text)

    return relevant_conditions


def recover_from_rejection(
    scheme_id: str,
    rejection_message: str
) -> dict:
    """
    Generate rejection-recovery guidance for a scheme.

    The response is based only on the scheme's stored data and
    the rejection reason supplied by the user.
    """

    if not normalize_text(rejection_message):
        raise ValueError(
            "Please provide the rejection message."
        )

    schemes = load_schemes()

    scheme = find_scheme(
        scheme_id,
        schemes
    )

    if scheme is None:
        raise ValueError(
            f"Scheme '{scheme_id}' not found."
        )

    scheme_name = scheme.get(
        "scheme_name",
        "This scheme"
    )

    eligibility = scheme.get(
        "eligibility",
        {}
    )

    required_documents = scheme.get(
        "required_documents",
        []
    )

    application_steps = scheme.get(
        "application_steps",
        []
    )

    official_portal = scheme.get(
        "official_portal"
    )

    source_url = scheme.get(
        "source_url"
    )

    manual_verification_required = scheme.get(
        "manual_verification_required",
        False
    )

    manual_verification_reason = scheme.get(
        "manual_verification_reason",
        ""
    )

    rejection_sentence = extract_rejection_sentence(
    rejection_message
    )

    reason = normalize_text(
        rejection_sentence
    )

    # --------------------------------------------------
    # Rejection category detection
    # --------------------------------------------------

    document_keywords = [
        "document",
        "documents",
        "missing",
        "proof",
        "certificate",
        "upload",
        "uploaded",
        "paper",
        "papers",
        "invalid",
        "incorrect",
        "incomplete"
    ]

    medical_keywords = [
        "medical",
        "medicine",
        "illness",
        "disease",
        "diagnosis",
        "hospital",
        "health",
        "treatment",
        "disability"
    ]

    registration_keywords = [
        "registration",
        "registered",
        "worker",
        "license",
        "licence",
        "identity",
        "aadhaar",
        "passport",
        "account"
    ]

    eligibility_keywords = [
        "eligibility",
        "eligible",
        "age",
        "income",
        "state",
        "district",
        "category",
        "occupation",
        "gender",
        "resident",
        "residence",
        "education",
        "course",
        "institution",
        "employment",
        "disability"
    ]

    verification_keywords = [
        "verification",
        "verified",
        "committee",
        "inspection",
        "approval",
        "manual",
        "authority",
        "pending",
        "review"
    ]

    category = "other"

    if text_contains_any(reason, medical_keywords):
        category = "medical_or_supporting_proof"

    elif text_contains_any(reason, registration_keywords):
        category = "registration_or_identity"

    elif text_contains_any(reason, document_keywords):
        category = "missing_or_incorrect_documents"

    elif text_contains_any(reason, eligibility_keywords):
        category = "eligibility_mismatch"

    elif text_contains_any(reason, verification_keywords):
        category = "manual_verification"

    # --------------------------------------------------
    # Category-specific guidance
    # --------------------------------------------------

    related_documents = []
    relevant_conditions = []

    if category == "missing_or_incorrect_documents":

        related_documents = find_related_documents(
            required_documents,
            [
                "document",
                "certificate",
                "proof",
                "card",
                "details",
                "photo",
                "income",
                "bank",
                "identity",
                "registration",
                "medical"
            ]
        )

        explanation = (
            "The supplied rejection reason may indicate that "
            "one or more required documents were missing, "
            "incorrect, incomplete, or not accepted."
        )

        next_steps = [
            "Check the rejection message and identify the document mentioned by the authority.",
            "Compare that document with the scheme's required-document list.",
            "Obtain a valid or corrected version of the document.",
            "Check whether the document details match the application.",
            "Submit the corrected document through the official application channel."
        ]

    elif category == "medical_or_supporting_proof":

        related_documents = find_related_documents(
            required_documents,
            [
                "medical",
                "illness",
                "disease",
                "diagnosis",
                "health",
                "disability",
                "hospital"
            ]
        )

        relevant_conditions = format_eligibility_conditions(
            eligibility,
            [
                "medical",
                "illness",
                "disease",
                "disability",
                "health",
                "registered",
                "registration"
            ]
        )

        explanation = (
            "The rejection letter states: "
            f"'{rejection_sentence}'. "
            "For this scheme, medical proof is required "
            "for specified serious illnesses. The submitted "
            "certificate may therefore need to be checked "
            "for the required diagnosis, validity, and "
            "supporting details."
        )

        next_steps = [
            "Check whether the medical condition mentioned in the application is covered by the scheme.",
            "Review the medical or disability proof required by the scheme.",
            "Obtain corrected or additional supporting proof if required.",
            "Confirm that the details in the proof match the application.",
            "Contact the implementing authority if the reason is unclear."
        ]

    elif category == "registration_or_identity":

        related_documents = find_related_documents(
            required_documents,
            [
                "registration",
                "worker",
                "identity",
                "aadhaar",
                "passport",
                "license",
                "licence",
                "card",
                "bank"
            ]
        )

        relevant_conditions = get_relevant_conditions(
            eligibility,
            [
                "registration",
                "worker",
                "occupation",
                "identity",
                "resident",
                "residence"
            ]
        )

        explanation = (
            "The supplied rejection reason may indicate an "
            "issue with registration, identity, or proof of "
            "the applicant's status."
        )

        next_steps = [
            "Check whether the required registration or identity information is valid.",
            "Compare the submitted details with the scheme's eligibility conditions.",
            "Correct any mismatch in names, identification details, or registration details.",
            "Obtain the relevant registration or identity proof if it is missing.",
            "Contact the implementing authority if registration status needs verification."
        ]

    elif category == "eligibility_mismatch":

        relevant_conditions = get_relevant_conditions(
            eligibility,
            eligibility_keywords
        )

        explanation = (
            "The supplied rejection reason may indicate that "
            "one or more eligibility conditions did not match "
            "the information submitted in the application."
        )

        next_steps = [
            "Compare the application details with the scheme's eligibility criteria.",
            "Check age, income, residence, occupation, category, education, or other relevant conditions.",
            "Correct inaccurate information only if the corrected information is genuine and supported by proof.",
            "If the applicant does not satisfy the criteria, check whether another scheme may be more suitable.",
            "Contact the implementing authority if the eligibility decision appears unclear."
        ]

    elif category == "manual_verification":

        explanation = (
            "The supplied rejection reason may indicate that "
            "the application required verification by the "
            "implementing authority or another reviewing body."
        )

        next_steps = [
            "Review the official rejection message carefully.",
            "Check whether the authority requested additional information or supporting proof.",
            "Provide the requested clarification or documents through the official channel.",
            "Contact the implementing authority to understand the verification status.",
            "Do not assume approval until the authority confirms it."
        ]

    else:

        explanation = (
            "The supplied rejection message does not contain "
            "enough information to identify the exact issue. "
            "The system cannot determine the rejection cause "
            "without additional details from the authority."
        )

        next_steps = [
            "Review the complete rejection message for a specific reason.",
            "Check whether the authority mentioned documents, eligibility, registration, or verification.",
            "Compare the mentioned issue with the scheme's actual eligibility and required-document information.",
            "Contact the implementing authority if the reason is unclear.",
            "Reapply only after understanding and correcting the issue."
        ]

    # --------------------------------------------------
    # Common guidance
    # --------------------------------------------------

    reapply_guidance = (
        "Reapply only after correcting the identified issue "
        "and confirming the current requirements through the "
        "official application channel."
    )

    return {
        "scheme_id": scheme.get("scheme_id"),
        "scheme_name": scheme_name,

        "rejection_message": rejection_message,

        "extracted_rejection_statement": rejection_sentence,

        "rejection_category": category,

        "rejection_explanation": explanation,

        "related_documents": related_documents,

        "relevant_eligibility_conditions": relevant_conditions,

        "next_steps": next_steps,

        "reapply_guidance": reapply_guidance,

        "manual_verification_required": (
            manual_verification_required
        ),

        "manual_verification_reason": (
            manual_verification_reason
        ),

        "application_steps": application_steps,

        "official_portal": official_portal,

        "source_url": source_url
    }