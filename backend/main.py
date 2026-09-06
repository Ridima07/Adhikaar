from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

from matcher import recommend_schemes, load_schemes
from document_checker import check_document_readiness

app = FastAPI()


class UserProfile(BaseModel):
    age: Optional[int] = None
    state: Optional[str] = None
    district: Optional[str] = None

    occupation: Optional[str] = None
    education_level: Optional[str] = None
    course_type: Optional[str] = None
    institution_type: Optional[str] = None

    annual_income: Optional[float] = None
    social_category: Optional[str] = None
    gender: Optional[str] = None

    disability_status: Optional[bool] = None
    disability_percentage: Optional[float] = None

    employment_status: Optional[str] = None
    user_type: Optional[str] = None

class DocumentCheckRequest(BaseModel):
    available_documents: list[str] = []

@app.get("/")
def home():
    return {
        "message": "Adhikaar backend is running"
    }


@app.post("/recommend")
def get_recommendations(user_profile: UserProfile):
    recommendations = recommend_schemes(
        user_profile.model_dump()
    )

    return {
        "total_recommendations": len(recommendations),
        "recommendations": recommendations
    }


@app.get("/scheme/{scheme_id}")
def get_scheme_details(scheme_id: str):
    schemes = load_schemes()

    for scheme in schemes:
        if str(scheme.get("scheme_id", "")).upper() == scheme_id.upper():

            eligibility = scheme.get("eligibility", {})

            return {
                "scheme_id": scheme.get("scheme_id"),
                "scheme_name": scheme.get("scheme_name"),
                "category": scheme.get("category"),

                "target_beneficiary": scheme.get(
                    "target_beneficiary", []
                ),

                "benefit": scheme.get("benefit", {}),

                "eligibility": eligibility,

                "additional_conditions": eligibility.get(
                    "other_conditions", []
                ),

                "required_documents": scheme.get(
                    "required_documents", []
                ),

                "optional_documents": scheme.get(
                    "optional_documents", []
                ),

                "application_steps": scheme.get(
                    "application_steps", []
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

                "manual_verification_required": scheme.get(
                    "manual_verification_required",
                    False
                ),

                "manual_verification_reason": scheme.get(
                    "manual_verification_reason",
                    ""
                )
            }

    raise HTTPException(
        status_code=404,
        detail="Scheme not found"
    )

@app.post("/scheme/{scheme_id}/document-check")
def check_scheme_documents(
    scheme_id: str,
    request: DocumentCheckRequest
):
    schemes = load_schemes()

    for scheme in schemes:
        if str(scheme.get("scheme_id", "")).upper() == scheme_id.upper():

            required_documents = scheme.get(
                "required_documents", []
            )

            document_status = check_document_readiness(
                required_documents,
                request.available_documents
            )

            return {
                "scheme_id": scheme.get("scheme_id"),
                "scheme_name": scheme.get("scheme_name"),
                **document_status
            }

    raise HTTPException(
        status_code=404,
        detail="Scheme not found"
    )