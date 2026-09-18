# Data privacy and participant information

## Consent model

Participants can complete DSLQ and receive the same result whether they agree to research storage or decline. A response is sent to the storage API only after an explicit **Yes, share my responses for research** choice.

The Dr. Udell class version also asks three required experience questions after showing the result. These ratings are stored as anonymous class feedback regardless of the research-storage choice. They are not linked to questionnaire answers or completion codes.

## Data stored with consent

- A randomly generated response ID and submission time
- Dog sex, used to select relevant health questions
- Answers to 37 behavioral items
- Answers to the sex-filtered general-health module
- Calculated score, interpretation band, health flag, and item scores
- Optional dog information entered after consent, such as name, age, breed, weight range, neuter status, and household animals
- The application version used for scoring
- A cohort label for consented responses submitted through the Dr. Udell class link

These records are stored in the `dslq_sessions` table in Cloudflare D1.

## Data not requested by the app

- Human demographics
- Human name, email address, or other contact information
- Location
- Browser or device fingerprint
- Advertising or analytics identifiers

Cloudflare necessarily processes normal request metadata to deliver and protect the service, but the application does not copy IP addresses or request headers into the research database.

## Declining consent

When a participant chooses not to share, the result is calculated in the browser and no questionnaire or dog-information record is written to D1.

Class feedback is stored separately in `class_feedback`. Completion codes are stored separately in `completion_codes`. Neither table contains a session ID or other field that can link it to a questionnaire response.

## Research context

Consented data are intended to support academic research on canine chronic stress. Published findings should use aggregate or de-identified data. For questions about data use, contact the repository maintainer through GitHub.
