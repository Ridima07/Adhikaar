# Adhikaar (अधिकार) — Intelligent Citizen Entitlement Platform

Adhikaar is an AI-driven, multilingual platform built to bridge the awareness and access gap between Indian citizens and government welfare schemes. By combining rules-based eligibility matching, proactive gap analysis, document readiness checks, and post-rejection recovery workflows, Adhikaar guides users seamlessly from scheme discovery to successful application.

---

## Key Features

* **Intelligent Scheme Recommendation:** Multi-attribute filtering (income, caste, state, education, disability) paired with ML relevance scoring.
* **Proactive Benefit Gap Analysis (`/benefit-gaps`):** "Near-miss" detection that identifies high-value schemes an applicant missed by a narrow margin, offering actionable guidance to bridge eligibility gaps.
* **Document Readiness Verification (`/document-check`):** Compares citizen-held documents against mandatory and optional scheme requirements to prevent avoidable rejections.
* **Post-Rejection Recovery (`/rejection-recovery`):** Ingests official rejection notices and generates step-by-step appeal workflows, alternative scheme pathways, and re-application guidance.
* **Multilingual Localization:** Dynamic query-level localization supporting English (`en`), Hindi (`hi`), and Bengali (`bn`).
* **Personalized Scheme Ranking:** Interactive questionnaire-based scoring tailored to immediate citizen priorities.

---

## System Architecture

```text
Adhikaar/
├── backend/
│   ├── main.py                     # FastAPI application routes & middleware
│   ├── matcher.py                  # Rule-based qualification engine
│   ├── document_checker.py         # Document completeness & verification
│   ├── rejection_recovery.py       # Rejection parsing & appeal generator
│   ├── translator.py               # Multilingual localization layer
│   ├── ml/                         # ML ranking & relevance models
│   │   └── saved_models/
│   └── personalization/
│       ├── benefit_gap.py          # Proactive near-miss analysis logic
│       └── personalize.py          # Dynamic questionnaires & weighting
├── frontend/                       # Frontend application (React/Vite)
└── README.md