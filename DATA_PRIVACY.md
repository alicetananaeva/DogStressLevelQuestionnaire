# Data Privacy & Participant Information

## What this app collects

The DSLQ app collects information about a participant's **dog** through a standardized behavioral questionnaire. No biometric data, location data, or device identifiers are collected.

### Data categories

| Category | Description | Required |
|---|---|---|
| Dog behavior responses | Answers to 37 behavioral items (frequency, context, duration) | Yes — needed for scoring |
| Dog health signs | Answers to up to 6 general health items (sex-filtered) | Yes — needed for scoring |
| Dog demographics | e.g. dog’s name (optional field in app), breed, age, sex, neuter status | Optional, consent-gated |
| Human demographics | Information about the caregiver / participant | Optional, consent-gated |
| Contact information | Name and email for future study updates | Optional — only if the participant explicitly opts in on the contact screen |

## Consent model

Participants are presented with an explicit consent screen before any optional **research** data is stored. They may:

- Complete the questionnaire and receive results **without sharing any research data**
- Consent to share **dog questionnaire data** for research
- Consent to share **human demographic data** for research
- Independently opt in to **future contact** (name and email) on a separate contact screen

The questionnaire result is shown regardless of these choices. **Research consent** and **future-contact consent** are independent: a participant may decline research sharing but still choose to leave contact details for future study updates (or the other way around).

## Data storage

### Production (deployed app)

When the app is deployed with cloud storage enabled, data are sent to **Supabase** (PostgreSQL). Two logical tables are used:

| Table | When data are stored | What is stored |
|-------|----------------------|----------------|
| **`dslq_sessions`** | Participant consents to share **questionnaire data** and/or **demographic data** for research | Session metadata, scores, behavioral and health answers, optional dog and human demographics (as consented). **Contact fields are not stored in this table.** |
| **`dslq_contacts`** | Participant opts in to **future contact** and provides a non-empty email | Session id, timestamp, optional name, email, future-contact flag, app version |

Behavioral/demographic research data and contact data are **separated by design** so that contact-only participation does not require research consent.

### Local / development (optional)

If the application is run with local storage mode, session data may be written as JSON files under a `dslq_sessions/` folder on the host. That folder is excluded from version control. This path is **not** the primary production model when Supabase is configured.

## What is NOT collected

- IP addresses (not intentionally recorded by the app)
- Browser or device fingerprints
- Cookies or tracking identifiers
- **Research** data (questionnaire answers, demographics for research) from participants who do not consent to sharing that category
- Contact data **without** explicit opt-in on the contact screen and a valid email when future contact is requested

**Note:** “No research data” is not the same as “no data at all.” If a participant only opts in to future contact, **only** the contact record (as above) may be stored — not questionnaire or demographic research content.

## Research context

This is an **independent research project** in the field of Human-Animal Interaction. The questionnaire instrument (DSLQ) is used with permission. Data collected through this app is intended to support academic research on canine chronic stress.

## Contact

For questions about data use, please contact the repository owner via GitHub.
