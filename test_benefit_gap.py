from backend.personalization.benefit_gap import analyze_benefit_gaps


# ============================================================
# TEST PROFILES
# ============================================================

PROFILES = {

    "PG Student - Delhi": {
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
        "institution_type":
            "UGC recognized university or college",
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
        "is_first_year_pg": False,
        "is_regular_full_time": True,
        "is_non_professional": True,
        "is_distance_education": False,
        "is_only_child": True,
    },


    "Construction Worker - Jharkhand": {
        "age": 35,
        "state": "Jharkhand",
        "district": "Ranchi",
        "occupation": "Construction Worker",
        "education_level": None,
        "course_type": None,
        "institution_type": None,
        "annual_income": None,
        "social_category": None,
        "gender": "male",
        "disability_status": False,
        "employment_status": "unorganized_worker",
        "user_type": [
            "construction_worker"
        ],
        "is_single_girl_child": False,
        "is_first_year_pg": False,
        "is_regular_full_time": False,
        "is_non_professional": False,
        "is_distance_education": False,
        "is_only_child": False,
    },


    "Senior Artist": {
        "age": 65,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "Artist",
        "education_level": None,
        "course_type": None,
        "institution_type": None,
        "annual_income": 30000,
        "social_category": None,
        "gender": "female",
        "disability_status": False,
        "employment_status": None,
        "user_type": [
            "artist",
            "cultural_practitioner"
        ],
        "is_single_girl_child": False,
        "is_first_year_pg": False,
        "is_regular_full_time": False,
        "is_non_professional": False,
        "is_distance_education": False,
        "is_only_child": False,
    },


    "Person With Severe Disability": {
        "age": 45,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": None,
        "education_level": None,
        "course_type": None,
        "institution_type": None,
        "annual_income": 30000,
        "social_category": "BPL",
        "gender": "female",
        "disability_status": True,
        "disability_percentage": 80,
        "employment_status": None,
        "user_type": [
            "person_with_disability"
        ],
        "is_single_girl_child": False,
        "is_first_year_pg": False,
        "is_regular_full_time": False,
        "is_non_professional": False,
        "is_distance_education": False,
        "is_only_child": False,
    },


    "Young Undergraduate Student": {
        "age": 19,
        "state": "Delhi",
        "district": "New Delhi",
        "occupation": "Student",
        "education_level": [
            "undergraduate"
        ],
        "course_type": [
            "regular"
        ],
        "institution_type":
            "UGC recognized university or college",
        "annual_income": None,
        "social_category": None,
        "gender": "female",
        "disability_status": False,
        "employment_status": "student",
        "user_type": [
            "student"
        ],
        "is_single_girl_child": False,
        "is_first_year_pg": False,
        "is_regular_full_time": True,
        "is_non_professional": True,
        "is_distance_education": False,
        "is_only_child": False,
    },


    "Low Income Rural Farmer": {
        "age": 42,
        "state": "Assam",
        "district": "Kamrup",
        "occupation": "Farmer",
        "education_level": None,
        "course_type": None,
        "institution_type": None,
        "annual_income": 40000,
        "social_category": None,
        "gender": "male",
        "disability_status": False,
        "employment_status": "self_employed",
        "user_type": [
            "farmer"
        ],
        "is_single_girl_child": False,
        "is_first_year_pg": False,
        "is_regular_full_time": False,
        "is_non_professional": False,
        "is_distance_education": False,
        "is_only_child": False,
    },


    "Indian Citizen Abroad": {
        "age": 30,
        "state": None,
        "district": None,
        "occupation": "Student",
        "education_level": [
            "postgraduate"
        ],
        "course_type": [
            "regular"
        ],
        "institution_type": None,
        "annual_income": None,
        "social_category": None,
        "gender": "female",
        "disability_status": False,
        "employment_status": "student",
        "user_type": [
            "student"
        ],
        "is_single_girl_child": False,
        "is_first_year_pg": False,
        "is_regular_full_time": True,
        "is_non_professional": False,
        "is_distance_education": False,
        "is_only_child": False,
        "residing_abroad": True,
        "distress_situation": True,
    },
}


# ============================================================
# RUN TESTS
# ============================================================

for profile_name, profile in PROFILES.items():

    print("\n")
    print("=" * 80)
    print(profile_name)
    print("=" * 80)

    try:
        results = analyze_benefit_gaps(
            profile,
            top_k=5
        )

    except Exception as e:
        print(f"ERROR: {type(e).__name__}: {e}")
        continue

    if not results:
        print("No benefit gaps found.")
        continue

    for index, result in enumerate(
        results,
        start=1
    ):

        print(
            f"\n{index}. "
            f"{result.get('scheme_id')} - "
            f"{result.get('scheme_name')}"
        )

        print(
            f"   Proximity: "
            f"{result.get('proximity_percentage', 0)}%"
        )

        print(
            f"   Blockers: "
            f"{result.get('blocker_count', 0)}"
        )

        blockers = result.get(
            "blockers",
            []
        )

        for blocker in blockers:

            print(
                f"      - "
                f"{blocker.get('field', 'unknown')}: "
                f"{blocker.get('condition', 'Unknown condition')}"
            )

            print(
                f"        Unlock: "
                f"{blocker.get('unlock_explanation', 'No explanation available')}"
            )