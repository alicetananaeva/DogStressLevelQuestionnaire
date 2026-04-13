# Changelog

All notable changes to the DSLQ App are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.0] — 2026-04

### Added
- Dynamic CSV loading for all questionnaire content — band thresholds and copy text loaded from CSV; some response mappings and frequency weights defined in code
- Encoding fallback (UTF-8 → UTF-8-sig → Latin-1) for CSV files
- Per-question Back/Next navigation — one question per screen
- Stable `session_id` (UUID) generated once per session
- General health module (Q38–42): sex-filtered symptom list, per-sign Yes/No + duration
- Unified question counter 1–42 across behavioral and health modules
- Contact screen with email validation and explicit opt-in
- Consent-gated data sharing (dog data and demographics independently)
- Structured JSON export with separate `behavior_answers` and `general_health_answers`
- `health_flag` derived from per-sign `gh_durations` (`none` / `reported` / `chronic`)
- Health interpretation on result screen: readable issue list with context-aware wording
- Pluggable storage layer (`STORAGE_MODE = "local"` | `"none"`)
- Screen order: intro → sex select → questionnaire → general health → sharing → contact → demographics → result → completion

### Changed
- Radio buttons default to no pre-selection (`index=None`) — no implicit answers
- Health module redesigned from multiselect to one-screen-per-symptom flow
- `gh_durations` correctly placed in `general_health_answers` in JSON export (not `behavior_answers`)
- "No, skip" button removed from sharing screen — Continue works regardless of checkbox state
- Result screen moved to last position (after all data collection)

### Removed
- Download JSON button (data saved server-side only)
- `Dog_Symptoms_Length` field (replaced by per-item `gh_durations`)
- `f=4` (context-only) responses excluded from symptom scoring
- Corvallis distance question from contact screen

---

## [1.0.0] — 2026-03

### Added
- Initial single-file Streamlit app (`dslq_app.py`)
- Hardcoded questionnaire content and scoring weights
- Basic result screen with interpretation band
- 17 unit tests for scoring logic
