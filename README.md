# Dog Stress Level Questionnaire (DSLQ)

A Streamlit web application for assessing chronic stress levels in dogs using the **Dog Stress Level Questionnaire (DSLQ)** — a questionnaire developed within Human-Animal Interaction research.

The app guides dog owners through a structured assessment and provides an automatically computed stress score with an evidence-based interpretation.

> **Independent research project** · Built with Python 3.10+ & Streamlit · MVP / in active development

[![Made with Streamlit](https://img.shields.io/badge/Made%20with-Streamlit-FF4B4B?logo=streamlit&logoColor=white)](https://streamlit.io)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://python.org)

---

## What is DSLQ?

The DSLQ is a standardized owner-report questionnaire designed to measure chronic stress in companion dogs. It covers 37 behavioral and health-related items across multiple domains (symptom frequency, duration, and intensity), plus a general health module. The output is a continuous stress score mapped to four interpretation bands: *Normal*, *Elevated*, *High*, and *Ultra High*.

This app makes the questionnaire accessible in a clean web interface, computes the score automatically, and provides an interpretation with context for the owner.

---

## Features

- **37-item behavioral questionnaire** with per-question frequency, context, and duration sub-items
- **General health module** with sex-filtered items (up to 6 signs, shown based on dog’s sex) and per-sign duration tracking
- **Automatic scoring** — band thresholds loaded from CSV; some response mappings and weights defined in code
- **Interpretation bands** with evidence-based copy
- **Health flag** (`none` / `reported` / `chronic`) based on reported health signs
- **Data export** as structured JSON (local storage, pluggable to cloud)
- **Consent-gated data sharing** — participants control what they share
- Single `.py` file, no database required to run locally

---

## Screenshots

> *(Add screenshots or a GIF of the app here)*

---

## Quick Start (local)

### 1. Clone the repo

```bash
git clone https://github.com/alicetananaeva/DogStressLevelQuestionnaire.git
cd DogStressLevelQuestionnaire
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the app

```bash
streamlit run dslq_app.py
```

The app will open at `http://localhost:8501`.

---

## Project Structure

```
DogStressLevelQuestionnaire/
│
├── dslq_app.py                     # Main Streamlit application (single file)
│
├── Source/                         # CSV configuration files (scoring authority)
│   ├── DSLQ_App_BehaviorItems.csv
│   ├── DSLQ_App_Copy.csv
│   ├── DSLQ_App_OptionalModules.csv
│   ├── DSLQ_App_ResponseOptions.csv
│   └── DSLQ_App_ScoringConfig.csv
│
├── dslq_sessions/                  # Auto-created at runtime — local JSON exports
│
├── .streamlit/
│   └── secrets.toml.example        # Template for cloud secrets (no real credentials)
│
├── requirements.txt
├── DATA_PRIVACY.md
├── CHANGELOG.md
└── README.md
```

---

## Deploying to Streamlit Community Cloud

1. Fork or push this repo to your GitHub account (must be **public**)
2. Go to [share.streamlit.io](https://share.streamlit.io) and sign in with GitHub
3. Click **New app** → select this repo → set main file to `dslq_app.py`
4. If using cloud storage (Supabase, etc.), add credentials under **Settings → Secrets** using the format in `.streamlit/secrets.toml.example`
5. Click **Deploy**

---

## Data & Privacy

Participation is voluntary. No personally identifiable information is collected unless the participant explicitly opts in on the contact screen.

- Current MVP stores session data locally as JSON on the app host
- Cloud storage via Supabase is planned for a future version

See [DATA_PRIVACY.md](DATA_PRIVACY.md) for full details.

---

## Scoring Logic

Band thresholds are loaded from `DSLQ_App_ScoringConfig.csv`. Some response mappings and frequency weights are defined in code. Bands:

| Band       | Score range     |
|------------|-----------------|
| Normal     | ≤ 5.60          |
| Elevated   | 5.61 – 7.98     |
| High       | 7.99 – 10.11    |
| Ultra High | > 10.11         |

Item weights follow a frequency × duration formula. Protective items (e.g., play, social contact) are scored inversely.

---

## Tech Stack

| Layer       | Tool                        |
|-------------|-----------------------------|
| UI & server | Streamlit                   |
| Data        | pandas, CSV files           |
| Storage     | Local JSON, `dslq_sessions/` folder (Supabase planned) |
| Language    | Python 3.10+                |

---

## Author

**Alisa Tananaeva**  
Researcher, Human-Animal Interaction  
[GitHub](https://github.com/alicetananaeva) · [LinkedIn](https://www.linkedin.com/in/alisa-tananaeva-448356300/)

---

## Project Status

- MVP complete, in active development
- Current deployment target: Streamlit Community Cloud
- Cloud storage: planned via Supabase
- Tested with Python 3.10+

---

## License

This project is shared for portfolio and research purposes. The DSLQ instrument is the intellectual property of its authors. Please contact the repository owner before using the scoring logic or questionnaire content in any derivative work.
