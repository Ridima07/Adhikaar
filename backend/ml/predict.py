import os
import joblib
import pandas as pd


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "saved_models",
    "scheme_relevance_model.pkl"
)


# --------------------------------------------------
# LOAD MODEL
# --------------------------------------------------

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model not found at: {MODEL_PATH}"
    )

model_data = joblib.load(MODEL_PATH)

pipeline = model_data["pipeline"]
threshold = model_data["threshold"]

print("ML model loaded successfully.")


# --------------------------------------------------
# PREDICT RELEVANCE
# --------------------------------------------------

def predict_relevance(user_profile, scheme):

    features = {
        "age": user_profile.get("age", 0),
        "annual_income": user_profile.get("annual_income", 0),

        "state": user_profile.get("state", ""),
        "occupation": user_profile.get("occupation", ""),
        "education_level": user_profile.get("education_level", ""),
        "social_category": user_profile.get("social_category", ""),
        "gender": user_profile.get("gender", ""),
        "employment_status": user_profile.get("employment_status", ""),
        "user_type": user_profile.get("user_type", ""),

        "scheme_category": scheme.get(
            "category",
            ""
        ),

        "beneficiary_level": scheme.get(
            "beneficiary_level",
            ""
        ),

        "required_documents_count": len(
            scheme.get("required_documents", [])
        ),

        "manual_verification_required": int(
            scheme.get(
                "manual_verification_required",
                False
            )
        ),

        "is_individual_scheme": int(
            scheme.get(
                "beneficiary_level",
                ""
            ) == "individual"
        )
    }

    df = pd.DataFrame([features])

    probability = pipeline.predict_proba(df)[0][1]

    prediction = int(
        probability >= threshold
    )

    return {
        "relevance_score": round(
            float(probability),
            4
        ),
        "is_relevant": prediction
    }


# --------------------------------------------------
# TEST
# --------------------------------------------------

if __name__ == "__main__":

    test_profile = {
        "age": 21,
        "annual_income": 150000,
        "state": "Delhi",
        "occupation": "student",
        "education_level": "undergraduate",
        "social_category": "general",
        "gender": "female",
        "employment_status": "student",
        "user_type": "individual"
    }

    test_scheme = {
        "category": "Education",
        "beneficiary_level": "individual",
        "required_documents": [
            "Aadhaar Card",
            "Income Certificate"
        ],
        "manual_verification_required": False
    }

    result = predict_relevance(
        test_profile,
        test_scheme
    )

    print("\nTest prediction:")
    print(result)