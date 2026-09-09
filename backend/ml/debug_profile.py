import json
import os
import sys

# Allow Python to import matcher.py from backend
sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from matcher import check_eligibility
from ml.prepare_dataset import USER_PROFILES


# --------------------------------------------------
# LOAD SCHEMES
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "data",
    "schemes.json"
)

with open(
    DATASET_PATH,
    "r",
    encoding="utf-8"
) as file:

    schemes = json.load(file)


# --------------------------------------------------
# SELECT PROFILE AND SCHEME
# --------------------------------------------------

profile = next(
    profile
    for profile in USER_PROFILES
    if profile.get("profile_id") == "P43"
)

scheme = next(
    scheme
    for scheme in schemes
    if scheme.get("scheme_id") == "EDU006"
)


# --------------------------------------------------
# RUN ELIGIBILITY CHECK
# --------------------------------------------------

result = check_eligibility(
    scheme,
    profile
)


# --------------------------------------------------
# PRINT OUTPUT
# --------------------------------------------------

print("PROFILE")

print(json.dumps(
    profile,
    indent=2,
    ensure_ascii=False
))

print("\nSCHEME")

print(json.dumps(
    scheme,
    indent=2,
    ensure_ascii=False
))

print("\nRESULT")

print(json.dumps(
    result,
    indent=2,
    ensure_ascii=False
))