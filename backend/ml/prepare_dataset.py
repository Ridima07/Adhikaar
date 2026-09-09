import os
import sys
import random
import pandas as pd

# Allow this script to import matcher.py from the backend folder
BACKEND_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

sys.path.insert(0, BACKEND_DIR)

from matcher import load_schemes, check_eligibility


# --------------------------------------------------
# SAMPLE USER PROFILES
# --------------------------------------------------

USER_PROFILES = [

    # 1. Undergraduate student from Delhi
    {
        "age": 20,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "student",
        "education_level": "undergraduate",
        "course_type": "degree",
        "institution_type": "college",
        "annual_income": 150000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "student",
    },

    # 2. Postgraduate student from Maharashtra
    {
        "age": 24,
        "state": "Maharashtra",
        "district": "Pune",
        "occupation": "student",
        "education_level": "postgraduate",
        "course_type": "masters",
        "institution_type": "university",
        "annual_income": 200000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "student",
    },

    # 3. PhD researcher
    {
        "age": 28,
        "state": "Maharashtra",
        "district": "Pune",
        "occupation": "researcher",
        "education_level": "phd",
        "course_type": "phd",
        "institution_type": "university",
        "annual_income": 300000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "researcher",
    },

    # 4. Construction worker from Jharkhand
    {
        "age": 35,
        "state": "Jharkhand",
        "district": "Ranchi",
        "occupation": "construction worker",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 120000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "employed",
        "user_type": "construction_worker",
    },

    # 5. Farmer from Rajasthan
    {
        "age": 45,
        "state": "Rajasthan",
        "district": "Jaipur",
        "occupation": "farmer",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 180000,
        "social_category": "obc",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "farmer",
    },

    # 6. Woman farmer / SHG member
    {
        "age": 38,
        "state": "Odisha",
        "district": "Khordha",
        "occupation": "farmer",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 100000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "shg_member",
    },

    # 7. Artist from Goa
    {
        "age": 22,
        "state": "Goa",
        "district": "North Goa",
        "occupation": "artist",
        "education_level": None,
        "course_type": None,
        "institution_type": None,
        "annual_income": 200000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "young_artist",
    },

    # 8. Experienced artist from Goa
    {
        "age": 32,
        "state": "Goa",
        "district": "South Goa",
        "occupation": "artist",
        "education_level": None,
        "course_type": None,
        "institution_type": None,
        "annual_income": 350000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "artist",
    },

    # 9. Person with disability
    {
        "age": 30,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "employee",
        "education_level": "graduate",
        "course_type": None,
        "institution_type": None,
        "annual_income": 300000,
        "social_category": "general",
        "gender": "female",
        "disability_status": True,
        "disability_percentage": 40,
        "employment_status": "employed",
        "user_type": "person_with_disability",
    },

    # 10. Low-income unemployed person
    {
        "age": 27,
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "occupation": "unemployed",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 60000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "unemployed",
        "user_type": "unemployed",
    },

    # 11. Research faculty member
    {
        "age": 42,
        "state": "Karnataka",
        "district": "Bengaluru",
        "occupation": "faculty",
        "education_level": "phd",
        "course_type": None,
        "institution_type": "university",
        "annual_income": 900000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "regular_employed",
        "user_type": "faculty",
    },

    # 12. Missing-information student
    {
        "age": 21,
        "state": "Delhi",
        "district": None,
        "occupation": "student",
        "education_level": "undergraduate",
        "course_type": None,
        "institution_type": None,
        "annual_income": None,
        "social_category": None,
        "gender": "female",
        "disability_status": None,
        "disability_percentage": None,
        "employment_status": "student",
        "user_type": "student",
    },

    # 13. Senior citizen
    {
        "age": 68,
        "state": "Rajasthan",
        "district": "Jaipur",
        "occupation": "retired",
        "education_level": None,
        "course_type": None,
        "institution_type": None,
        "annual_income": 90000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "retired",
        "user_type": "senior_citizen",
    },

    # 14. Entrepreneur
    {
        "age": 29,
        "state": "Gujarat",
        "district": "Ahmedabad",
        "occupation": "entrepreneur",
        "education_level": "graduate",
        "course_type": None,
        "institution_type": None,
        "annual_income": 250000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "entrepreneur",
    },

    # 15. Institutional / NGO applicant
    {
        "age": None,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "ngo",
        "education_level": None,
        "course_type": None,
        "institution_type": "registered_society",
        "annual_income": None,
        "social_category": None,
        "gender": None,
        "disability_status": None,
        "disability_percentage": None,
        "employment_status": None,
        "user_type": "ngo",
    },
        # 16. Maharashtra VJNT postgraduate student
    {
        "age": 22,
        "state": "Maharashtra",
        "district": "Pune",
        "occupation": "student",
        "education_level": "postgraduate",
        "course_type": "masters",
        "institution_type": "university",
        "annual_income": 120000,
        "social_category": "vjnt",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "student",
    },

    # 17. Student with disability
    {
        "age": 21,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "student",
        "education_level": "undergraduate",
        "course_type": "degree",
        "institution_type": "college",
        "annual_income": 100000,
        "social_category": "general",
        "gender": "male",
        "disability_status": True,
        "disability_percentage": 60,
        "employment_status": "student",
        "user_type": "student",
    },

    # 18. Scheduled Caste school student
    {
        "age": 15,
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "occupation": "student",
        "education_level": "secondary",
        "course_type": "school",
        "institution_type": "school",
        "annual_income": 90000,
        "social_category": "sc",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "student",
    },

    # 19. Single girl child pursuing postgraduate studies
    {
        "age": 23,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "student",
        "education_level": "postgraduate",
        "course_type": "masters",
        "institution_type": "university",
        "annual_income": 180000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "single_girl_child",
    },

    # 20. Minority postgraduate student
    {
        "age": 24,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "student",
        "education_level": "postgraduate",
        "course_type": "masters",
        "institution_type": "university",
        "annual_income": 150000,
        "social_category": "minority",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "student",
    },

    # 21. Electronics and IT PhD student
    {
        "age": 27,
        "state": "Karnataka",
        "district": "Bengaluru",
        "occupation": "researcher",
        "education_level": "phd",
        "course_type": "phd",
        "institution_type": "university",
        "annual_income": 300000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "researcher",
    },

    # 22. Woman science researcher
    {
        "age": 30,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "researcher",
        "education_level": "phd",
        "course_type": "phd",
        "institution_type": "university",
        "annual_income": 350000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "researcher",
    },

    # 23. Low-income person requiring medical assistance
    {
        "age": 40,
        "state": "Rajasthan",
        "district": "Jaipur",
        "occupation": "worker",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 70000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "employed",
        "user_type": "medical_assistance_seeker",
    },

    # 24. Person with a rare disease
    {
        "age": 18,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "student",
        "education_level": "undergraduate",
        "course_type": "degree",
        "institution_type": "college",
        "annual_income": 80000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "rare_disease_patient",
    },

    # 25. Delhi resident seeking medical assistance
    {
        "age": 52,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "worker",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 100000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "employed",
        "user_type": "medical_assistance_seeker",
    },

    # 26. Nagaland resident seeking health insurance
    {
        "age": 35,
        "state": "Nagaland",
        "district": "Kohima",
        "occupation": "employee",
        "education_level": "graduate",
        "course_type": None,
        "institution_type": None,
        "annual_income": 180000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "employed",
        "user_type": "healthcare_seeker",
    },

    # 27. West Bengal transport worker
    {
        "age": 42,
        "state": "West Bengal",
        "district": "Kolkata",
        "occupation": "transport worker",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 110000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "employed",
        "user_type": "transport_worker",
    },

    # 28. Fisherman
    {
        "age": 39,
        "state": "Kerala",
        "district": "Alappuzha",
        "occupation": "fisherman",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 100000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "fisherman",
    },

    # 29. Assam farmer
    {
        "age": 46,
        "state": "Assam",
        "district": "Kamrup",
        "occupation": "farmer",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 130000,
        "social_category": "general",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "farmer",
    },

    # 30. Rural landowner
    {
        "age": 50,
        "state": "Madhya Pradesh",
        "district": "Bhopal",
        "occupation": "farmer",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 160000,
        "social_category": "obc",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "rural_landowner",
    },

    # 31. Minority entrepreneur
    {
        "age": 32,
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "occupation": "entrepreneur",
        "education_level": "graduate",
        "course_type": None,
        "institution_type": None,
        "annual_income": 220000,
        "social_category": "minority",
        "gender": "male",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "entrepreneur",
    },

    # 32. SC/ST entrepreneur
    {
        "age": 30,
        "state": "Gujarat",
        "district": "Ahmedabad",
        "occupation": "entrepreneur",
        "education_level": "graduate",
        "course_type": None,
        "institution_type": None,
        "annual_income": 200000,
        "social_category": "sc",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "entrepreneur",
    },

    # 33. Traditional craft worker
    {
        "age": 36,
        "state": "Rajasthan",
        "district": "Jaipur",
        "occupation": "craft worker",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 90000,
        "social_category": "minority",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "traditional_artisan",
    },

    # 34. Adolescent girl
    {
        "age": 15,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "student",
        "education_level": "secondary",
        "course_type": "school",
        "institution_type": "school",
        "annual_income": 60000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "student",
        "user_type": "adolescent_girl",
    },

    # 35. Transgender person seeking shelter
    {
        "age": 29,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "unemployed",
        "education_level": "secondary",
        "course_type": None,
        "institution_type": None,
        "annual_income": 50000,
        "social_category": "general",
        "gender": "transgender",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "unemployed",
        "user_type": "transgender_person",
    },

    # 36. Young performing artist
    {
        "age": 24,
        "state": "Gujarat",
        "district": "Ahmedabad",
        "occupation": "artist",
        "education_level": "graduate",
        "course_type": None,
        "institution_type": None,
        "annual_income": 100000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "self_employed",
        "user_type": "young_artist",
    },

    # 37. Cultural institution
    {
        "age": None,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "cultural institution",
        "education_level": None,
        "course_type": None,
        "institution_type": "registered_society",
        "annual_income": None,
        "social_category": None,
        "gender": None,
        "disability_status": None,
        "disability_percentage": None,
        "employment_status": None,
        "user_type": "cultural_institution",
    },

    # 38. Woman seeking legal/community support
    {
        "age": 34,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "employee",
        "education_level": "graduate",
        "course_type": None,
        "institution_type": None,
        "annual_income": 200000,
        "social_category": "general",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "employed",
        "user_type": "woman_seeking_support",
    },

    # 39. Person with missing disability certificate
    {
        "age": 31,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "employee",
        "education_level": "graduate",
        "course_type": None,
        "institution_type": None,
        "annual_income": 180000,
        "social_category": "general",
        "gender": "male",
        "disability_status": True,
        "disability_percentage": None,
        "employment_status": "employed",
        "user_type": "person_with_disability",
    },

    # 40. Low-income BPL senior citizen
    {
        "age": 70,
        "state": "West Bengal",
        "district": "Kolkata",
        "occupation": "retired",
        "education_level": None,
        "course_type": None,
        "institution_type": None,
        "annual_income": 45000,
        "social_category": "bpl",
        "gender": "female",
        "disability_status": False,
        "disability_percentage": 0,
        "employment_status": "retired",
        "user_type": "senior_citizen",
    },

    # P41: VJNT student from Maharashtra
    {
        "state": "Maharashtra",
        "age": 20,
        "annual_income": 100000,
        "occupation": "student",
        "education_level": "post-matric",
        "social_category": "VJNT",
        "gender": "female",
        "disability_status": "no",
        "employment_status": "student",
        "user_type": "individual",
    },

    # P42: SC student
    {
        "state": "Delhi",
        "age": 18,
        "annual_income": 90000,
        "occupation": "student",
        "education_level": "pre-matric",
        "social_category": "SC",
        "gender": "female",
        "disability_status": "no",
        "employment_status": "student",
        "user_type": "individual",
    },

    # P43: Single girl child pursuing postgraduate education
        {
        "profile_id": "P43",
        "state": "Delhi",
        "age": 23,
        "annual_income": None,
        "occupation": "Student",
        "education_level": ["postgraduate", "master_degree"],
        "social_category": None,
        "gender": "female",
        "disability_status": None,
        "employment_status": "student",
        "user_type": ["student", "single_girl_child"],
        "course_type": ["regular", "non_professional"],
        "institution_type": "UGC recognized university or college",
        "is_single_girl_child": True,
    },

    # P44: Student with disability
    {
        "state": "Delhi",
        "age": 22,
        "annual_income": 100000,
        "occupation": "student",
        "education_level": "post-matric",
        "social_category": "general",
        "gender": "female",
        "disability_status": "yes",
        "employment_status": "student",
        "user_type": "individual",
    },

    # P45: Senior citizen with disability and low income
    {
        "state": "Delhi",
        "age": 68,
        "annual_income": 60000,
        "occupation": "retired",
        "education_level": "not_applicable",
        "social_category": "general",
        "gender": "female",
        "disability_status": "yes",
        "employment_status": "retired",
        "user_type": "individual",
    },

    # P46: PhD student in Electronics/IT
    {
        "state": "Delhi",
        "age": 26,
        "annual_income": 180000,
        "occupation": "student",
        "education_level": "PhD",
        "field_of_study": "Information Technology",
        "social_category": "general",
        "gender": "female",
        "disability_status": "no",
        "employment_status": "student",
        "user_type": "individual",
    },

    # P47: In-service faculty member
    {
        "state": "Delhi",
        "age": 39,
        "annual_income": 900000,
        "occupation": "faculty",
        "education_level": "PhD",
        "social_category": "general",
        "gender": "female",
        "disability_status": "no",
        "employment_status": "employed",
        "is_in_service_faculty": True,
        "user_type": "faculty",
    },

    # P48: Active fisherman
    {
        "state": "Assam",
        "age": 42,
        "annual_income": 180000,
        "occupation": "fisherman",
        "education_level": "not_applicable",
        "social_category": "general",
        "gender": "male",
        "disability_status": "no",
        "employment_status": "self-employed",
        "user_type": "fisherman",
    },

    # P49: Person from Nagaland requiring healthcare
    {
        "state": "Nagaland",
        "age": 35,
        "annual_income": 150000,
        "occupation": "worker",
        "education_level": "graduate",
        "social_category": "general",
        "gender": "female",
        "disability_status": "no",
        "employment_status": "employed",
        "user_type": "individual",
    },

    # P50: Adolescent girl
    {
        "state": "Delhi",
        "age": 15,
        "annual_income": 50000,
        "occupation": "student",
        "education_level": "school",
        "social_category": "general",
        "gender": "female",
        "disability_status": "no",
        "employment_status": "student",
        "user_type": "individual",
    },

    # P51: Minority entrepreneur
    {
        "state": "Bihar",
        "age":  30,
        "annual_income": 250000,
        "occupation": "entrepreneur",
        "education_level": "graduate",
        "social_category": "minority",
        "gender": "male",
        "disability_status": "no",
        "employment_status": "self-employed",
        "user_type": "business",
    },

    # P52: Engineer/researcher
    {
        "state": "Delhi",
        "age": 34,
        "annual_income": 700000,
        "occupation": "researcher",
        "education_level": "PhD",
        "field_of_study": "Engineering",
        "social_category": "general",
        "gender": "female",
        "disability_status": "no",
        "employment_status": "employed",
        "user_type": "individual",
    },
]

# Automatically assign stable profile IDs
for index, profile in enumerate(USER_PROFILES, start=1):
    profile["profile_id"] = f"P{index:02d}"

# --------------------------------------------------
# FEATURE GENERATION
# --------------------------------------------------

def create_features(user_profile, scheme, eligibility_result):
    """
    Converts one user-scheme comparison into ML features.
    These features are generated from the deterministic
    eligibility engine.
    """

    matched_conditions = eligibility_result.get(
        "matched_conditions", []
    )

    failed_conditions = eligibility_result.get(
        "failed_conditions", []
    )

    missing_information = eligibility_result.get(
        "missing_information", []
    )

    # Ensure these values are always lists
    if not isinstance(matched_conditions, list):
        matched_conditions = []

    if not isinstance(failed_conditions, list):
        failed_conditions = []

    if not isinstance(missing_information, list):
        missing_information = []

    matched = len(matched_conditions)
    failed = len(failed_conditions)
    missing = len(missing_information)

    total_conditions = matched + failed + missing

    if total_conditions > 0:
        match_percentage = matched / total_conditions
    else:
        match_percentage = 0.0

    scheme_category = scheme.get(
        "category",
        scheme.get("scheme_category", "")
    )

    required_documents = scheme.get(
        "required_documents",
        scheme.get("documents_required", [])
    )

    if not isinstance(required_documents, list):
        required_documents = []

    return {
        # User features
        "profile_id": user_profile.get(
            "profile_id",
            "unknown"
        ),

        "age": user_profile.get("age") or 0,

        "annual_income": user_profile.get(
            "annual_income"
        ) or 0,

        "state": user_profile.get(
            "state",
            ""
        ),

        "occupation": user_profile.get(
            "occupation",
            ""
        ),

        "education_level": user_profile.get(
            "education_level",
            ""
        ),

        "social_category": user_profile.get(
            "social_category",
            ""
        ),

        "gender": user_profile.get(
            "gender",
            ""
        ),

        "disability_status": int(
            bool(user_profile.get("disability_status"))
        ),

        "employment_status": user_profile.get(
            "employment_status",
            ""
        ),

        "user_type": user_profile.get(
            "user_type",
            ""
        ),

        # Scheme features
        "scheme_id": scheme.get(
            "scheme_id",
            ""
        ),

        "scheme_category": scheme_category,

        "beneficiary_level": scheme.get(
            "beneficiary_level",
            "individual"
        ),

        # Eligibility features
        "matched_conditions": matched,

        "failed_conditions": failed,

        "missing_conditions": missing,

        "match_percentage": match_percentage,

        "required_documents_count": len(
            required_documents
        ),

        "manual_verification_required": int(
            bool(
                scheme.get(
                    "manual_verification_required",
                    False
                )
            )
        ),

        # Useful condition indicators
        "has_failed_condition": int(
            failed > 0
        ),

        "has_missing_information": int(
            missing > 0
        ),

        "is_individual_scheme": int(
            scheme.get(
                "beneficiary_level",
                "individual"
            ) == "individual"
        ),

        # Current deterministic result
        "status": eligibility_result.get(
            "status",
            "not_eligible"
        ),

        # Weak-supervision label
        "relevance_label": create_label(
            eligibility_result,
            scheme
        ),

        "is_relevant": int(
            eligibility_result["status"]
            in ["eligible", "possibly_eligible"]
        ),
    }

# --------------------------------------------------
# INITIAL LABEL GENERATION
# --------------------------------------------------

def create_label(
    eligibility_result: Dict[str, Any],
    scheme: Dict[str, Any]
) -> int:
    """
    Original graded relevance label.

    0 = not eligible
    1 = possibly eligible
    2 = eligible
    """

    status = eligibility_result.get("status")

    # Institutional/community schemes should not be treated
    # as individual recommendations.
    beneficiary_level = scheme.get(
        "beneficiary_level",
        "individual"
    )

    if beneficiary_level != "individual":
        return 0

    if status == "eligible":
        return 2

    if status == "possibly_eligible":
        return 1

    return 0

# --------------------------------------------------
# MAIN
# --------------------------------------------------

# --------------------------------------------------
# MAIN
# --------------------------------------------------

def main():
    schemes = load_schemes()

    rows = []

    for user_profile in USER_PROFILES:
        for scheme in schemes:

            eligibility_result = check_eligibility(
                scheme,
                user_profile
            )

            features = create_features(
                user_profile,
                scheme,
                eligibility_result
            )

            rows.append(features)

    df = pd.DataFrame(rows)

    output_path = os.path.join(
        BACKEND_DIR,
        "data",
        "training_data.csv"
    )

    df.to_csv(
        output_path,
        index=False
    )

    print("Dataset created successfully.")
    print("Number of profiles:", len(USER_PROFILES))
    print("Number of schemes:", len(schemes))
    print("Number of rows:", len(df))
    print("Number of columns:", len(df.columns))

    print("\nLabel distribution:")
    print(
        df["relevance_label"]
        .value_counts()
        .sort_index()
    )

    print("\nStatus distribution:")
    print(
        df["status"]
        .value_counts()
    )

    print("\nPositive and potentially relevant schemes:")
    print(
        df[df["relevance_label"] > 0]
        .groupby(
            ["scheme_id", "scheme_category"]
        )["relevance_label"]
        .count()
        .sort_values(
            ascending=False
        )
    )

    print("\nFirst five rows:")
    print(
        df.head().to_string(
            index=False
        )
    )


if __name__ == "__main__":
    main()