# Dog Stress Level Questionnaire (DSLQ)

DSLQ is a psychometric instrument designed to assess chronic stress in companion dogs. It was developed in the Human-Animal Interaction Lab at Oregon State University under the supervision of Dr. Monique Udell, with Alisa Tananaeva as lead developer.

The web application administers the questionnaire, calculates the chronic stress score, returns an interpretation, and optionally stores consented responses for research.

## Live app

[Open DSLQ on Cloudflare](https://dslq.dogperspective.com/)

## Current architecture

- **Interface:** accessible vanilla HTML, CSS, and JavaScript served by Cloudflare Workers Static Assets
- **API:** Cloudflare Worker (`src/worker.js`)
- **Research storage:** Cloudflare D1 (`dslq_research`)
- **Scoring:** shared browser/server module (`public/scoring.js`), so submitted answers are validated and recalculated on the server
- **Consent:** the result is shown whether the participant consents or declines; only consented responses are sent to the API

This deployment does not depend on Streamlit uptime or Supabase project activity.

## Features

- 37 behavioral items with frequency, days-per-week, and duration follow-ups where applicable
- Sex-filtered general-health module
- Four interpretation bands: Normal, Elevated, High, and Extremely High
- Health flag (`none`, `reported`, or `chronic`)
- Optional dog-demographic fields shown only after research consent
- Consent-gated D1 storage with no human demographics or contact information
- Responsive one-question-per-screen interface

## Data storage

The `dslq_sessions` D1 table stores consented research records: a random session ID, score and interpretation, item scores, behavioral and health answers, and optional dog information. No record is created when a participant declines research storage.

See [DATA_PRIVACY.md](DATA_PRIVACY.md) for details.

## Scoring bands

| Band | Score |
|---|---:|
| Normal | ≤ 5.60 |
| Elevated | > 5.60 to 7.98 |
| High | > 7.98 to 10.11 |
| Extremely High | > 10.11 |

Symptom items use the original frequency × days-per-week weighting when the sign has been present for more than two weeks. Protective items are scored inversely.

## Local development

Requires Node.js 20+.

```bash
pnpm install
pnpm run d1:migrate:local
pnpm run dev
```

Run the scoring checks with:

```bash
pnpm test
```

## Deployment

The D1 binding and deployed database ID are defined in `wrangler.toml`.

```bash
pnpm run d1:migrate:remote
pnpm run deploy
```

The earlier Streamlit/Supabase implementation remains in `dslq_app.py` as a reference and rollback option; it is not used by the Cloudflare deployment.

### Historical Supabase records

Export the old `dslq_sessions` table as a JSON array, then prepare an idempotent D1 import file:

```bash
pnpm run supabase:prepare -- supabase-dslq-export.json > dslq-d1-import.sql
pnpm exec wrangler d1 execute dslq_research --remote --file dslq-d1-import.sql
```

The converter imports only rows with research consent, preserves existing session IDs and timestamps, and uses `INSERT OR IGNORE` so rerunning the same import does not duplicate responses. Export and generated import files may contain participant data and must not be committed.

## Project structure

```text
public/                  Browser interface and shared scoring module
src/worker.js            API and server-side validation
migrations/              D1 schema migrations
test/                    Scoring tests
Source/                  Original DSLQ source/configuration files
dslq_app.py              Previous Streamlit implementation
wrangler.toml            Cloudflare deployment configuration
```

## License

This project is shared for portfolio and research purposes. The DSLQ instrument is the intellectual property of its authors. Contact the repository owner before using the scoring logic or questionnaire content in derivative work.
