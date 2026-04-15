# Dog Stress Level Questionnaire (DSLQ)

Dog Stress Level Questionnaire (DSLQ) is a psychometric instrument designed to assess chronic stress in companion dogs. It was developed in the Human-Animal Interaction Lab at Oregon State University under the supervision of Dr. Monique Udell, with Alisa Tananaeva as lead developer.

The validation procedure showed good internal consistency, inter-rater and test–retest reliability, and evidence of construct, external, and criterion validity.

DSLQ-App makes the questionnaire easier to use in practice, calculates the chronic stress score automatically, and returns an interpretable result. It also supports separate, consent-based data collection for research purposes.

> **Research-based web application** · Built with Python 3.10+ & Streamlit · MVP / in active development

[![Made with Streamlit](https://img.shields.io/badge/Made%20with-Streamlit-FF4B4B?logo=streamlit&logoColor=white)](https://streamlit.io)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://python.org)

---

## Live app

Open the deployed app here: [DSLQ-App](https://dslq-app.streamlit.app/)

---

## What is DSLQ?

The DSLQ is a standardized caregiver-report questionnaire designed to measure chronic stress in companion dogs. It covers 37 behavioral and health-related items across multiple domains (symptom frequency, duration, and intensity), plus a general health module. The output is a continuous stress score mapped to four interpretation bands: *Normal*, *Elevated*, *High*, and *Ultra High*.

This app makes the questionnaire accessible in a clean web interface, computes the score automatically, and returns an interpretable result.

---

## Features

- **37-item behavioral questionnaire** with per-question frequency, context, and duration sub-items
- **General health module** with sex-filtered items (up to 6 signs, shown based on dog’s sex) and per-sign duration tracking
- **Automatic scoring** — band thresholds loaded from CSV; some response mappings and weights defined in code
- **Interpretation bands** with evidence-based copy
- **Health flag** (`none` / `reported` / `chronic`) based on reported health signs
- **Cloud storage (production)** — research data and contact data stored in Supabase (see below)
- **Optional local fallback** — structured JSON under `dslq_sessions/` when `STORAGE_MODE = "local"` (development / no cloud)
- **Consent-gated sharing** — research data only with questionnaire/demographic consent; future-contact opt-in stored separately
- Single entry point: **`dslq_app.py`** (CSV-driven content; no separate DB process required locally)

---

## Project Structure

```
DogStressLevelQuestionnaire/
│
├── dslq_app.py                     # Main Streamlit application
│
├── Source/                         # CSV configuration files (scoring authority)
│   ├── DSLQ_App_BehaviorItems.csv
│   ├── DSLQ_App_Copy.csv
│   ├── DSLQ_App_OptionalModules.csv
│   ├── DSLQ_App_ResponseOptions.csv
│   └── DSLQ_App_ScoringConfig.csv
│
├── dslq_sessions/                  # Optional — created only if local JSON storage is enabled
│
├── .streamlit/
│   └── secrets.toml.example        # Template for Supabase / secrets (no real credentials)
│
├── requirements.txt
├── DATA_PRIVACY.md
├── CHANGELOG.md
└── README.md
```

---

## Data storage (Supabase)

| Table | Contents |
|-------|----------|
| **`dslq_sessions`** | Research records when the participant consents to share questionnaire and/or demographic data (scores, answers, optional dog/human demographics). **Contact details are not stored in this table.** |
| **`dslq_contacts`** | Name, email, and future-contact consent when the participant opts in on the contact screen — **independent** of research consent (contact-only path supported). |

Local JSON under `dslq_sessions/` applies only when the app is configured for local storage mode (e.g. development).

---

## Data & Privacy

Participation is voluntary. Research data is stored only with explicit consent. Contact information is stored only with a separate explicit opt-in on the contact screen.

See [DATA_PRIVACY.md](DATA_PRIVACY.md) for full details.

---

## Scoring Logic

Band thresholds are loaded from `DSLQ_App_ScoringConfig.csv`. Some response mappings and frequency weights are defined in code. Interpretation bands are derived from score thresholds established during the psychometric evaluation of the DSLQ. Bands:

| Band       | Score range     |
|------------|-----------------|
| Normal     | ≤ 5.60          |
| Elevated   | 5.61 – 7.98     |
| High       | 7.99 – 10.11    |
| Ultra High | > 10.11         |

Item weights follow a frequency × duration formula. Protective items (e.g., play, social contact) are scored inversely.

---

## Tech Stack

| Layer       | Tool |
|-------------|------|
| UI & server | Streamlit |
| Data        | pandas, CSV files |
| Storage (deployed) | Supabase (PostgreSQL via PostgREST) — `dslq_sessions`, `dslq_contacts` |
| Storage (optional) | Local JSON (`dslq_sessions/`) when `STORAGE_MODE = "local"` |
| Language    | Python 3.10+ (stdlib `urllib` for Supabase REST calls) |

---

## Author

**Alisa Tananaeva**  
Animal Behavior & Welfare Scientist 
https://alicetananaeva.com

---

## Project Status

- Functional web application deployed and in use.
- Public deployment runs on Streamlit Community Cloud.
- Supabase-backed storage for research and contact data.
- Tested with Python 3.10+

---

## License

This project is shared for portfolio and research purposes. The DSLQ instrument is the intellectual property of its authors. Please contact the repository owner before using the scoring logic or questionnaire content in any derivative work.
