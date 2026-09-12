# Adhikaar (अधिकार) — Intelligent Citizen Entitlement & Welfare Platform

> Transforming government welfare delivery from a fragmented, passive directory into a proactive, end-to-end citizen advocate.

---

## What is Adhikaar?

Government welfare in India spans thousands of Central and State schemes designed to uplift marginalized and deserving populations. However, millions of eligible citizens miss out due to three fundamental bottlenecks:

1. **Information Asymmetry:** Welfare criteria are buried inside complex government gazettes and bureaucratic language.
2. **The "Near-Miss" Void:** Traditional portals abandon citizens who fall just outside criteria without explaining *how close* they were or what small credential (e.g., e-Shram registration, income declaration correction) would qualify them.
3. **The Rejection Dead-End:** When an application is rejected, citizens rarely receive understandable explanations, appeal mechanisms, or alternative schemes.

**Adhikaar** bridges this gap. It acts as an active entitlement concierge that:
* Matches citizens deterministically to eligible schemes.
* Analyzes **borderline near-misses** proactively through our Benefit Gap Engine.
* Verifies **document readiness** before submission to prevent procedural disqualification.
* Demystifies official rejection messages and formulates structured **appeal & re-application playbooks**.
* Serves citizens in their native language across **English, Hindi, and Bengali**.

---

## System Architecture & User Journey Flowchart

```text
               +--------------------------------------------------+
               |              Citizen Web Interface               |
               |         (React + Vite + Tailwind CSS)            |
               +--------------------------------------------------+
                                        |
                 REST API Requests (JSON / Multi-language: en, hi, bn)
                                        |
                                        v
+---------------------------------------------------------------------------------+
|                               FASTAPI BACKEND                                   |
|                                                                                 |
|  +---------------------------+       +---------------------------------------+  |
|  |       API Router          | <---> |            Translator Layer           |  |
|  |     (backend/main.py)     |       |         (backend/translator.py)       |  |
|  +---------------------------+       +---------------------------------------+  |
|       |                 |                            |               |          |
|       | (Profile Data)  | (Borderline Criteria)      | (Docs list)   | (Denial) |
|       v                 v                            v               v          |
|  +-------------+  +------------------+         +------------+  +-------------+  |
|  | Rule-Based  |  | Benefit Gap      |         |  Document  |  |  Rejection  |  |
|  |   Matcher   |  | Analysis Engine  |         |  Checker   |  |  Recovery   |  |
|  |  Engine     |  |                  |         |            |  |   Module    |  |
|  +-------------+  +------------------+         +------------+  +-------------+  |
|       |                 |                            |               |          |
|       v                 |                            |               |          |
|  +-------------+        |                            |               |          |
|  | ML Scorer & |        |                            |               |          |
|  | Personalizer|        |                            |               |          |
|  +-------------+        |                            |               |          |
|       |                 |                            |               |          |
+-------|-----------------|----------------------------|---------------|----------+
        |                 |                            |               |
        +-----------------+-------------+--------------+---------------+
                                        |
                                        v
                    +---------------------------------------+
                    |            Structured Data            |
                    |   * Eligibility Status                |
                    |   * Actionable Gap Thresholds         |
                    |   * Missing Documentation List        |
                    |   * Official Appeal Workflows         |
                    +---------------------------------------+



                    Architectural Workflow: Step-by-Step
Step 1: Ingestion & Localization

The user supplies demographic information. The backend accepts a lang parameter (en, hi, bn) and dynamically runs localized responses through translator.py.

Step 2: Dual-Stage Matching

Stage 1 (Deterministic): Non-negotiable criteria (income caps, caste, state domicile, disability criteria) are filtered via matcher.py.

Stage 2 (ML Relevance & Personalization): Qualifying schemes pass through our ML relevance model (saved_models/scheme_relevance_model.pkl) and dynamic prioritization questionnaire (personalize.py) to rank schemes according to individual user urgency and impact.

Step 3: Proactive Gap Analysis (/benefit-gaps)

The engine checks schemes the citizen narrowly missed (e.g., income threshold within 10–15%, minor age criteria, or missing registry cards) and returns concrete actions to bridge the gap.

Step 4: Pre-Application Verification (/document-check)

Citizen-held documents are compared against mandatory and optional scheme requirements to guarantee documentation readiness prior to official filing.

Step 5: Post-Rejection Recovery (/rejection-recovery)

Official rejection letters or error notifications are parsed to formulate structured administrative appeals, nodal officer contacts, and alternative scheme recommendations.

Project Directory Structure
Adhikaar/
├── backend/
│   ├── data/                               # Structured welfare scheme repositories & criteria
│   ├── ml/                                 # Trained ML ranking and relevance models
│   │   └── saved_models/
│   │       └── scheme_relevance_model.pkl  # Scheme relevance scoring model
│   ├── personalization/                    # Contextual adaptation modules
│   │   ├── benefit_gap.py                  # Proactive near-miss / gap discovery engine
│   │   └── personalize.py                  # Dynamic follow-up questionnaire logic
│   ├── document_checker.py                 # Pre-application document validation
│   ├── matcher.py                          # Deterministic qualification engine
│   ├── rejection_recovery.py               # Post-denial appeal & recovery parser
│   ├── translator.py                       # Resilient multi-language localization
│   └── main.py                             # FastAPI routing, schemas, and middleware
├── frontend/                               # React + Vite application
│   ├── src/                                # UI components, forms, and views
│   └── package.json                        # Frontend dependencies & scripts
├── requirements.txt                        # Python dependencies
└── README.md                               # Project documentation