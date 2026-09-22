CREATE TABLE IF NOT EXISTS class_submissions (
  submission_id TEXT PRIMARY KEY,
  cohort_key TEXT NOT NULL,
  student_name TEXT NOT NULL,
  dog_name TEXT,
  dog_sex TEXT NOT NULL,
  behavior_answers_json TEXT NOT NULL,
  health_durations_json TEXT NOT NULL,
  dog_demographics_json TEXT NOT NULL,
  chronic_score REAL NOT NULL,
  interpretation_band TEXT NOT NULL,
  overall_experience INTEGER NOT NULL,
  clarity INTEGER NOT NULL,
  result_usefulness INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_dslq_class_submissions_cohort ON class_submissions(cohort_key, created_at);
