# Data Privacy & Participant Information

## What this app collects

The DSLQ app collects information about a participant's **dog** through a standardized behavioral questionnaire. No biometric data, location data, or device identifiers are collected.

### Data categories

| Category | Description | Required |
|---|---|---|
| Dog behavior responses | Answers to 37 behavioral items (frequency, context, duration) | Yes — needed for scoring |
| Dog health signs | Answers to up to 6 general health items (sex-filtered) | Yes — needed for scoring |
| Dog demographics | Species, breed, age, sex, neuter status | Optional, consent-gated |
| Owner demographics | Relationship to dog, experience level | Optional, consent-gated |
| Contact information | Name and email address | Optional, explicit opt-in only |

## Consent model

Participants are presented with an explicit consent screen before any optional data is stored. They may:

- Complete the questionnaire and receive results **without sharing any data**
- Consent to share **dog questionnaire data** for research
- Consent to share **demographic data** for research
- Opt in to receive future study updates by providing contact information

All three are independent choices. The questionnaire result is shown regardless of consent decisions.

## Data storage

**Current version (local / MVP):**  
Session data is stored as JSON files in the `dslq_sessions/` directory on the app host server. This folder is excluded from version control via `.gitignore`.

**Planned (cloud version):**  
Consented session data will be stored in Supabase (PostgreSQL). Only consented records are transmitted. Contact information is stored separately from behavioral data.

## What is NOT collected

- IP addresses
- Browser or device fingerprints
- Cookies or tracking identifiers
- Any data from participants who do not consent to sharing

## Research context

This is an **independent research project** in the field of Human-Animal Interaction. The questionnaire instrument (DSLQ) is used with permission. Data collected through this app is intended to support academic research on canine chronic stress.

## Contact

For questions about data use, please contact the repository owner via GitHub.
