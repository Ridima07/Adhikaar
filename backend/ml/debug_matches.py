import os
import sys
import json

BACKEND_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

sys.path.insert(0, BACKEND_DIR)

from matcher import load_schemes, check_eligibility
from prepare_dataset import USER_PROFILES


def main():
    schemes = load_schemes()

    print("\nSCHEME MATCH DIAGNOSTIC")
    print("=" * 70)

    for scheme in schemes:
        scheme_id = scheme.get("scheme_id", "UNKNOWN")
        scheme_name = scheme.get(
            "name",
            scheme.get("scheme_name", "")
        )

        eligible_profiles = []
        possible_profiles = []

        for profile in USER_PROFILES:
            result = check_eligibility(
                scheme,
                profile
            )

            profile_id = profile.get(
                "profile_id",
                "unknown"
            )

            if result.get("status") == "eligible":
                eligible_profiles.append(profile_id)

            elif result.get("status") == "possibly_eligible":
                possible_profiles.append(profile_id)

        print(f"\n{scheme_id} - {scheme_name}")
        print(f"Eligible profiles: {eligible_profiles}")
        print(f"Possibly eligible profiles: {possible_profiles}")

        if not eligible_profiles and not possible_profiles:
            print("No matching profile found.")

    print("\nDiagnostic completed.")


if __name__ == "__main__":
    main()