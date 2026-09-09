from rejection_recovery import recover_from_rejection
from matcher import load_schemes

schemes = load_schemes()

if not schemes:
    print("No schemes found.")
else:
    scheme = schemes[0]

    result = recover_from_rejection(
        scheme.get("scheme_id"),
        "Application rejected because the required income certificate was missing."
    )

    print(result)