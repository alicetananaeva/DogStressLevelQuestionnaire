ALTER TABLE dslq_sessions ADD COLUMN participant_code TEXT;
ALTER TABLE class_feedback ADD COLUMN participant_code TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dslq_sessions_participant_code
  ON dslq_sessions(participant_code)
  WHERE participant_code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dslq_feedback_participant_code
  ON class_feedback(participant_code)
  WHERE participant_code IS NOT NULL;
