def normalize_document(document):
    return document.strip().lower()


def check_document_readiness(required_documents, available_documents):
    available_normalized = {
        normalize_document(document)
        for document in available_documents
    }

    available = []
    missing = []

    for document in required_documents:
        if normalize_document(document) in available_normalized:
            available.append(document)
        else:
            missing.append(document)

    total_required = len(required_documents)

    if total_required == 0:
        readiness_percentage = 100.0
    else:
        readiness_percentage = round(
            (len(available) / total_required) * 100,
            2
        )

    return {
        "available_documents": available,
        "missing_documents": missing,
        "readiness_percentage": readiness_percentage,
        "total_required_documents": total_required,
        "total_available_documents": len(available),
        "total_missing_documents": len(missing)
    }