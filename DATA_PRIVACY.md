# Data privacy and participant information

## Consent model

Participants can complete DSLQ and receive the same result whether they agree to research storage or decline. A response is sent to the storage API only after an explicit **Yes, share my responses for research** choice.

The Dr. Udell class version also asks three required experience questions after showing the result. These ratings are stored as anonymous class feedback regardless of the research-storage choice and are assigned a random participant code. If the participant consents to research storage, the same code links the feedback to the questionnaire score. The code is not linked to a name or contact detail unless the participant independently chooses to share it.

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

Class feedback is stored in `class_feedback`, and participant codes are stored in `completion_codes`. For the Dr. Udell class pilot, both tables contain the random participant code. A consented record in `dslq_sessions` contains that same code; when consent is declined, no questionnaire or dog-information record is created and only the code plus the three feedback ratings are retained.

## Research context

Consented data are intended to support academic research on canine chronic stress. Published findings should use aggregate or de-identified data. For questions about data use, contact the repository maintainer through GitHub.
