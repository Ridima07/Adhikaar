import sys
from pathlib import Path

# Add both root and backend directories to sys.path
backend_dir = Path(__file__).resolve().parent
root_dir = backend_dir.parent

for path in (str(backend_dir), str(root_dir)):
    if path not in sys.path:
        sys.path.insert(0, path)

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from matcher import recommend_schemes, load_schemes
from document_checker import check_document_readiness
from rejection_recovery import recover_from_rejection
from translator import translate_data, SUPPORTED_LANGUAGES

from personalization.personalize import (
    get_questions_for_scheme,
    personalize_schemes
)


app = FastAPI(title="Adhikaar API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


class RejectionRecoveryRequest(BaseModel):
    rejection_message: str


class PersonalizationQuestionRequest(BaseModel):
    profile: dict
    scheme_ids: list[str]


class PersonalizationRecommendRequest(BaseModel):
    profile: dict
    scheme_ids: list[str]
    answers_by_scheme: dict


@app.get("/")
def home(
    lang: str = Query(
        "en",
        description="Supported: en, hi, bn"
    )
):
    response = {
        "message": "Adhikaar backend is running",
        "supported_languages": list(
            SUPPORTED_LANGUAGES.keys()
        )
    }

    return translate_data(
        response,
        target_lang=lang
    )


@app.post("/recommend")
def get_recommendations(
    user_profile: UserProfile,
    lang: str = Query(
        "en",
        description="Supported: en, hi, bn"
    )
):
    recommendations = recommend_schemes(
        user_profile.model_dump()
    )

    response = {
        "total_recommendations": len(recommendations),
        "recommendations": recommendations,
    }

    return translate_data(
        response,
        target_lang=lang
    )


@app.get("/scheme/{scheme_id}")
def get_scheme_details(
    scheme_id: str,
    lang: str = Query(
        "en",
        description="Supported: en, hi, bn"
    )
):
    schemes = load_schemes()

    for scheme in schemes:
        if (
            str(scheme.get("scheme_id", "")).upper()
            == scheme_id.upper()
        ):
            eligibility = scheme.get(
                "eligibility",
                {}
            )

            result = {
                "scheme_id": scheme.get("scheme_id"),
                "scheme_name": scheme.get("scheme_name"),
                "category": scheme.get("category"),
                "target_beneficiary": scheme.get(
                    "target_beneficiary",
                    []
                ),
                "benefit": scheme.get(
                    "benefit",
                    {}
                ),
                "eligibility": eligibility,
                "additional_conditions": eligibility.get(
                    "other_conditions",
                    []
                ),
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
                "manual_verification_required": scheme.get(
                    "manual_verification_required",
                    False
                ),
                "manual_verification_reason": scheme.get(
                    "manual_verification_reason",
                    ""
                ),
            }

            return translate_data(
                result,
                target_lang=lang
            )

    raise HTTPException(
        status_code=404,
        detail="Scheme not found"
    )


@app.post("/scheme/{scheme_id}/document-check")
def check_scheme_documents(
    scheme_id: str,
    request: DocumentCheckRequest,
    lang: str = Query(
        "en",
        description="Supported: en, hi, bn"
    )
):
    schemes = load_schemes()

    for scheme in schemes:
        if (
            str(scheme.get("scheme_id", "")).upper()
            == scheme_id.upper()
        ):
            required_documents = scheme.get(
                "required_documents",
                []
            )

            document_status = check_document_readiness(
                required_documents,
                request.available_documents
            )

            result = {
                "scheme_id": scheme.get("scheme_id"),
                "scheme_name": scheme.get("scheme_name"),
                **document_status,
            }

            return translate_data(
                result,
                target_lang=lang
            )

    raise HTTPException(
        status_code=404,
        detail="Scheme not found"
    )


@app.post("/scheme/{scheme_id}/rejection-recovery")
def scheme_rejection_recovery(
    scheme_id: str,
    request: RejectionRecoveryRequest,
    lang: str = Query(
        "en",
        description="Supported: en, hi, bn"
    )
):
    try:
        result = recover_from_rejection(
            scheme_id,
            request.rejection_message
        )

        return translate_data(
            result,
            target_lang=lang
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@app.post("/personalization/questions")
def get_personalization_questions_endpoint(
    request: PersonalizationQuestionRequest
):
    schemes = load_schemes()

    questions_by_scheme = {}

    for scheme in schemes:
        scheme_id = str(
            scheme.get("scheme_id", "")
        )

        if scheme_id not in request.scheme_ids:
            continue

        questions = get_questions_for_scheme(
            scheme,
            request.profile
        )

        if questions:
            questions_by_scheme[scheme_id] = {
                "scheme_name": scheme.get(
                    "scheme_name"
                ),
                "questions": questions
            }

    return {
        "questions_by_scheme": questions_by_scheme
    }


@app.post("/personalization/recommend")
def get_personalized_recommendations(
    request: PersonalizationRecommendRequest
):
    schemes = load_schemes()

    selected_schemes = [
        scheme
        for scheme in schemes
        if str(
            scheme.get("scheme_id", "")
        ) in request.scheme_ids
    ]

    results = personalize_schemes(
        request.profile,
        selected_schemes,
        request.answers_by_scheme
    )

    return {
        "total_recommendations": len(results),
        "recommendations": results
    }