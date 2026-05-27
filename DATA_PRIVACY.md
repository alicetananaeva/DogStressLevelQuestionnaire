# Data Privacy & Participant Information

## What this app collects

The DSLQ app collects information about a participant's **dog** through a standardized behavioral questionnaire. No biometric data, location data, or device identifiers are collected.

### Data categories

| Category | Description | Required |
|---|---|---|
| Dog behavior responses | Answers to 37 behavioral items (frequency, context, duration) | Yes — needed for scoring |
| Dog health signs | Answers to up to 6 general health items (sex-filtered) | Yes — needed for scoring |
| Dog demographics | e.g. dog’s name (optional field in app), breed, age, sex, neuter status | Optional, consent-gated |

## Consent model

Participants are presented with an explicit consent screen before any optional **research** data is stored. They may:

- Complete the questionnaire and receive results **without sharing any research data**
- Consent to share **questionnaire responses and dog information** for research

The questionnaire result is shown regardless of this choice. The current app does not collect human demographics or contact information.

## Data storage

### Production (deployed app)

When the app is deployed with cloud storage enabled, data are sent to **Supabase** (PostgreSQL).

| Table | When data are stored | What is stored |
|-------|----------------------|----------------|
| **`dslq_sessions`** | Participant consents to share **questionnaire responses and dog information** for research | Session metadata, scores, behavioral and health answers, optional dog demographics |

### Local / development (optional)

If the application is run with local storage mode, session data may be written as JSON files under a `dslq_sessions/` folder on the host. That folder is excluded from version control. This path is **not** the primary production model when Supabase is configured.

## What is NOT collected

- IP addresses (not intentionally recorded by the app)
- Browser or device fingerprints
- Cookies or tracking identifiers
- **Research** data from participants who do not consent to sharing
- Human demographics
- Contact information

## Research context

This is an **independent research project** in the field of Human-Animal Interaction. The questionnaire instrument (DSLQ) is used with permission. Data collected through this app is intended to support academic research on canine chronic stress.

## Contact

For questions about data use, please contact the repository owner via GitHub.
