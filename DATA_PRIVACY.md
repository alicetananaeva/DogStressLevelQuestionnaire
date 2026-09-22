# Data privacy and participant information

## Consent model

Participants can complete DSLQ and receive the same result whether they agree to research storage or decline. A response is sent to the storage API only after an explicit **Yes, share my responses for research** choice.

The Dr. Udell class version (`?class=drudell`) is a separate instructional pilot. It does **not** show the research-consent question or write to `dslq_sessions`. Before the questionnaire, it asks for the student's name (required) and dog's name (optional). At the end, it stores all behavioral and health answers, optional dog information, the calculated score, and three required experience ratings together in `class_submissions`. The protected class dashboard shows names and full answers. Students should use the same name in PPS and DSLQ to make cross-survey matching possible. These identifiable class records are not consented research data and must not be copied into the research tables or used for publishable research without the appropriate institutional review and permissions.

## Data stored with consent

- A randomly generated response ID and submission time
- Dog sex, used to select relevant health questions
- Answers to 37 behavioral items
- Answers to the sex-filtered general-health module
- Calculated score, interpretation band, health flag, and item scores
- Optional dog information entered after consent, such as name, age, breed, weight range, neuter status, and household animals
- The application version used for scoring

These records are stored in the `dslq_sessions` table in Cloudflare D1.

## Data not requested by the public app

- Human demographics
- Human name, email address, or other contact information
- Location
- Browser or device fingerprint
- Advertising or analytics identifiers

Cloudflare necessarily processes normal request metadata to deliver and protect the service, but the application does not copy IP addresses or request headers into the research database.

## Declining consent

When a participant chooses not to share, the result is calculated in the browser and no questionnaire or dog-information record is written to D1.

The public version does not store a questionnaire record after declined consent. The class version has a different notice and storage path described above. Legacy coded class records created before this change remain in `class_feedback` and `completion_codes`; they are not silently reassigned to named students.

## Research context

Consented data are intended to support academic research on canine chronic stress. Published findings should use aggregate or de-identified data. For questions about data use, contact the repository maintainer through GitHub.
