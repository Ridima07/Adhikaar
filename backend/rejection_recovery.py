"""
Rejection Recovery for Adhikaar.

This module explains possible rejection-related issues using the information
already present in schemes.json and dynamically generates formal administrative
appeal drafts and escalation pathways based on the citizen's profile.
"""

from __future__ import annotations

from datetime import date
from typing import Any

from backend.matcher import load_schemes


def normalize_text(value: Any) -> str:
    """Convert a value into normalized lowercase text."""
    if value is None:
        return ""
    return str(value).strip().lower()


def find_scheme(scheme_id: str, schemes: list[dict]) -> dict | None:
    """Find a scheme using its scheme_id. Matching is case-insensitive."""
    requested_id = normalize_text(scheme_id)

    for scheme in schemes:
        current_id = normalize_text(scheme.get("scheme_id", ""))
        if current_id == requested_id:
            return scheme

    return None


def text_contains_any(text: str, keywords: list[str]) -> bool:
    """Check whether any keyword appears in the given text."""
    normalized = normalize_text(text)
    return any(keyword in normalized for keyword in keywords)


def extract_rejection_sentence(rejection_message: str) -> str:
    """
    Find the most relevant sentence from a rejection letter.
    Rule-based extraction targeting operational rejection terminology.
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
        "requirement",
        "mismatch"
    ]

    for sentence in sentences:
        if text_contains_any(sentence, rejection_keywords):
            return sentence

    return rejection_message.strip()


def format_eligibility_conditions(
    eligibility: dict,
    keywords: list[str]
) -> list[str]:
    """Return meaningful eligibility conditions as separate items."""
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

            original_text = value.get("original_text")
            condition_text = str(original_text) if original_text else str(value)

        elif isinstance(value, list):
            for item in value:
                if item and text_contains_any(str(item), keywords):
                    relevant_conditions.append(str(item))
            continue
        else:
            condition_text = str(value)

        field_text = str(field).replace("_", " ")
        combined_text = f"{field_text}: {condition_text}"

        if text_contains_any(combined_text, keywords):
            relevant_conditions.append(combined_text)

    return relevant_conditions


def find_related_documents(
    required_documents: list[str],
    keywords: list[str]
) -> list[str]:
    """Find required documents related to a rejection category."""
    related_documents = []
    for document in required_documents:
        if text_contains_any(document, keywords):
            related_documents.append(document)
    return related_documents


def get_relevant_conditions(
    eligibility: dict,
    keywords: list[str]
) -> list[str]:
    """Return only meaningful eligibility conditions related to the rejection category."""
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
            value_text = str(value)
        else:
            value_text = str(value)

        field_text = str(field).replace("_", " ")
        combined_text = f"{field_text}: {value_text}"

        if text_contains_any(combined_text, keywords):
            relevant_conditions.append(combined_text)

    return relevant_conditions


def generate_appeal_representation(
    applicant_name: str,
    application_id: str,
    phone_number: str,
    state: str,
    scheme_name: str,
    ministry: str,
    rejection_reason: str,
    corrective_action: str
) -> str:
    """Generate a formal administrative representation and grievance letter."""
    today_str = date.today().strftime("%d-%m-%Y")

    letter_template = f"""Date: {today_str}

To,
The Competent Authority / Nodal Grievance Redressal Officer,
{ministry},
District Welfare & Grievance Redressal Cell, {state}

Subject: Formal Representation & Administrative Appeal regarding rejection of Application ID: {application_id} for '{scheme_name}'

Respected Sir / Madam,

I, {applicant_name}, resident of {state}, am formally submitting this representation in response to the rejection notification received concerning my application under '{scheme_name}' (Reference ID: {application_id}).

1. Stated Ground for Rejection:
"{rejection_reason}"

2. Factual Clarification & Corrective Measures:
In accordance with scheme norms, the noted ground has been reviewed and addressed:
- Corrective Measure Undertaken: {corrective_action}
- Verified documentary evidence, authenticated revenue/category certificates, and valid identification proofs have been compiled and attached herewith.

3. Prayer / Relief Sought:
Considering that the procedural discrepancy stands corrected with authenticated records attached, I respectfully request your office to:
a) Re-open and review Application ID {application_id} on merit.
b) Grant condonation for procedural clarification and sanction the entitled assistance.

Thanking you for your time and fair consideration.

Yours faithfully,

{applicant_name}
Application Reference ID: {application_id}
Contact Number: {phone_number}
State: {state}
Enclosures: Updated Supporting Records & Copy of Rejection Notice Slip
"""
    return letter_template.strip()


def recover_from_rejection(
    scheme_id: str,
    rejection_message: str,
    applicant_name: str = "Citizen Applicant",
    application_id: str = "REF-2026-PENDING",
    phone_number: str = "Not Specified",
    state: str = "Delhi"
) -> dict:
    """
    Generate rejection-recovery guidance and formal appeal documentation for a scheme.
    """
    if not normalize_text(rejection_message):
        raise ValueError("Please provide the rejection message.")

    schemes = load_schemes()
    scheme = find_scheme(scheme_id, schemes)

    if scheme is None:
        raise ValueError(f"Scheme '{scheme_id}' not found.")

    scheme_name = scheme.get("scheme_name", "This scheme")
    eligibility = scheme.get("eligibility", {})
    required_documents = scheme.get("required_documents", [])
    application_steps = scheme.get("application_steps", [])
    official_portal = scheme.get("official_portal")
    source_url = scheme.get("source_url")
    manual_verification_required = scheme.get("manual_verification_required", False)
    manual_verification_reason = scheme.get("manual_verification_reason", "")

    # Scheme metadata or defaults
    ministry = scheme.get(
        "ministry",
        "Department of Social Welfare & Public Grievance Redressal"
    )
    helpline = scheme.get("helpline_number", "1800-11-0031 / 14434")

    rejection_sentence = extract_rejection_sentence(rejection_message)
    reason = normalize_text(rejection_sentence)

    # --------------------------------------------------
    # Rejection category detection
    # --------------------------------------------------
    document_keywords = [
        "document", "documents", "missing", "proof", "certificate",
        "upload", "uploaded", "paper", "papers", "invalid", "incorrect", "incomplete"
    ]

    medical_keywords = [
        "medical", "medicine", "illness", "disease", "diagnosis",
        "hospital", "health", "treatment", "disability"
    ]

    registration_keywords = [
        "registration", "registered", "worker", "license", "licence",
        "identity", "aadhaar", "passport", "account", "mismatch"
    ]

    eligibility_keywords = [
        "eligibility", "eligible", "age", "income", "state", "district",
        "category", "occupation", "gender", "resident", "residence",
        "education", "course", "institution", "employment", "disability"
    ]

    verification_keywords = [
        "verification", "verified", "committee", "inspection", "approval",
        "manual", "authority", "pending", "review"
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
                "document", "certificate", "proof", "card", "details",
                "photo", "income", "bank", "identity", "registration", "medical"
            ]
        )
        explanation = (
            "The supplied rejection reason indicates that one or more required "
            "documents were missing, incorrect, incomplete, or rejected during verification."
        )
        next_steps = [
            "Identify the specific document mentioned in the rejection slip.",
            "Cross-verify the document details against the required-document list for this scheme.",
            "Obtain a certified, updated replacement from the competent issuing authority.",
            "Ensure spelling of personal details matches official identification records.",
            "Submit the corrected documentation alongside a formal representation."
        ]

    elif category == "medical_or_supporting_proof":
        related_documents = find_related_documents(
            required_documents,
            ["medical", "illness", "disease", "diagnosis", "health", "disability", "hospital"]
        )
        relevant_conditions = format_eligibility_conditions(
            eligibility,
            ["medical", "illness", "disease", "disability", "health", "registered", "registration"]
        )
        explanation = (
            f"The rejection letter states: '{rejection_sentence}'. "
            "This scheme requires certified medical or disability proof issued by an empaneled "
            "hospital or medical board."
        )
        next_steps = [
            "Verify that the medical diagnosis meets the qualifying condition guidelines of the scheme.",
            "Procure a signed disability/medical certificate from a recognized Chief Medical Officer (CMO).",
            "Ensure the hospital registration number and medical officer stamp are clearly legible.",
            "Attach the authorized medical board report with your appeal."
        ]

    elif category == "registration_or_identity":
        related_documents = find_related_documents(
            required_documents,
            ["registration", "worker", "identity", "aadhaar", "passport", "license", "licence", "card", "bank"]
        )
        relevant_conditions = get_relevant_conditions(
            eligibility,
            ["registration", "worker", "occupation", "identity", "resident", "residence"]
        )
        explanation = (
            "The rejection points to an issue with identity authentication, worker registration status, "
            "or clerical discrepancies across linked official databases."
        )
        next_steps = [
            "Check for clerical discrepancies between your identity document, bank passbook, and portal registration.",
            "Update any mismatched details through an authorized enrollment centre.",
            "Procure a notarized affidavit verifying clerical consistency if names vary slightly.",
            "Resubmit the validated identity proof to the grievance authority."
        ]

    elif category == "eligibility_mismatch":
        relevant_conditions = get_relevant_conditions(
            eligibility,
            eligibility_keywords
        )
        explanation = (
            "The rejection indicates a recorded mismatch with scheme eligibility limits "
            "(such as income thresholds, age brackets, or educational criteria)."
        )
        next_steps = [
            "Review your application entries against the scheme's statutory eligibility criteria.",
            "If income was miscalculated by the reviewing officer, secure an updated Tehsil Revenue Income Certificate.",
            "Provide documentary corroboration (marksheet, ration card, or category certificate) supporting actual eligibility.",
            "Submit a formal representation requesting re-evaluation based on verified certificates."
        ]

    elif category == "manual_verification":
        explanation = (
            "The application required manual field verification or physical committee review "
            "which was either not completed or returned an adverse finding."
        )
        next_steps = [
            "Contact your local District Social Welfare Office or Block Development Office (BDO).",
            "Ascertain whether a field inspection report was filed and request a written copy.",
            "Submit an administrative representation enclosing local residential corroboration.",
            "Request a re-inspection through the official grievance desk."
        ]

    else:
        explanation = (
            "The rejection message requires further administrative clarification. "
            "The system cannot isolate the exact clause without additional details from the issuing desk."
        )
        next_steps = [
            "Request a detailed speaking order citing the specific clause or rule violated.",
            "Submit an administrative representation to the District Grievance Officer within 30 days.",
            "Confirm current documentation guidelines directly through official portal links."
        ]

    # --------------------------------------------------
    # Generate Appeal Draft & Escalation Channels
    # --------------------------------------------------
    primary_action = next_steps[0] if next_steps else "Submit authenticated rectification documents."

    appeal_draft = generate_appeal_representation(
        applicant_name=applicant_name,
        application_id=application_id,
        phone_number=phone_number,
        state=state,
        scheme_name=scheme_name,
        ministry=ministry,
        rejection_reason=rejection_sentence,
        corrective_action=primary_action
    )

    state_portal_url = (
        "https://edistrict.delhigovt.nic.in"
        if normalize_text(state) == "delhi"
        else "https://pgportal.gov.in"
    )

    escalation_channels = {
        "ministry": ministry,
        "online_portal": {
            "title": "Central Public Grievance Portal (CPGRAMS)",
            "url": "https://pgportal.gov.in",
            "instructions": f"Log in to CPGRAMS, select '{ministry}', and paste the appeal draft into the grievance description."
        },
        "state_desk": {
            "title": f"{state} Public Grievance / e-District Redressal",
            "url": state_portal_url,
            "instructions": "Submit a formal grievance ticket attaching the appeal draft and certified proofs."
        },
        "physical_desk": {
            "title": "District Social Welfare / SDM Office",
            "instructions": "Print this representation letter, sign it, attach photocopies of your proofs, and obtain a stamped acknowledgement slip."
        },
        "helpline": helpline
    }

    reapply_guidance = (
        "Reapply or submit your appeal representation within the statutory appeal window "
        "(typically 15 to 30 days from the rejection date) with rectified documentation."
    )

    return {
        "scheme_id": scheme.get("scheme_id"),
        "scheme_name": scheme_name,
        "applicant_name": applicant_name,
        "application_id": application_id,
        "rejection_message": rejection_message,
        "extracted_rejection_statement": rejection_sentence,
        "rejection_category": category,
        "rejection_explanation": explanation,
        "related_documents": related_documents,
        "relevant_eligibility_conditions": relevant_conditions,
        "next_steps": next_steps,
        "appeal_draft": appeal_draft,
        "escalation_channels": escalation_channels,
        "reapply_guidance": reapply_guidance,
        "manual_verification_required": manual_verification_required,
        "manual_verification_reason": manual_verification_reason,
        "application_steps": application_steps,
        "official_portal": official_portal,
        "source_url": source_url
    }