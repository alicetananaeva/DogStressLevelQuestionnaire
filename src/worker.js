import { APP_VERSION, calculateDslq, validateDslq } from "../public/scoring.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function isUuid(value) {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function cohortForClassKey(value) {
  return value === "drudell" ? "drudell_fall_2026" : null;
}

function validRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

function validName(value, required = true) {
  return typeof value === "string" && (!required || value.trim().length > 0)
    && value.trim().length <= 120 && !/[\x00-\x1f\x7f]/.test(value);
}

async function saveClassSubmission(request, env) {
  if (Number(request.headers.get("content-length") || 0) > 128_000) return json({ error: "Request is too large." }, 413);
  let payload;
  try { payload = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
  if (payload?.classKey !== "drudell") return json({ error: "Unknown class." }, 400);
  if (!isUuid(payload.submissionId) || !validName(payload.studentName)
    || !validName(payload.dogName || "", false)
    || !validRating(payload.enjoyment) || !validRating(payload.clarity)
    || !validRating(payload.resultUsefulness)
    || !validateDslq(payload.dogSex, payload.behaviorAnswers, payload.healthDurations)) {
    return json({ error: "Incomplete class submission." }, 400);
  }
  const result = calculateDslq(payload.dogSex, payload.behaviorAnswers, payload.healthDurations);
  const demographics = safeDemographics(payload.dogDemographics);
  try {
    const saved = await env.DB.prepare(`
      INSERT OR IGNORE INTO class_submissions (
        submission_id, cohort_key, student_name, dog_name, dog_sex,
        behavior_answers_json, health_durations_json, dog_demographics_json,
        chronic_score, interpretation_band, overall_experience, clarity, result_usefulness
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(payload.submissionId, "drudell_fall_2026", payload.studentName.trim(),
      (payload.dogName || "").trim() || null, payload.dogSex, JSON.stringify(payload.behaviorAnswers),
      JSON.stringify(payload.healthDurations), JSON.stringify(demographics), result.total,
      result.band, payload.enjoyment, payload.clarity, payload.resultUsefulness).run();
    return json({ saved: true, duplicate: saved.meta?.changes === 0 });
  } catch {
    return json({ error: "The class submission could not be saved." }, 503);
  }
}

function completionCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = () => Array.from(crypto.getRandomValues(new Uint8Array(4)), (value) => alphabet[value % alphabet.length]).join("");
  return `DSLQ-${part()}-${part()}`;
}

async function saveCompletion(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  if (payload?.classKey !== "drudell") return json({ error: "Unknown class." }, 400);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = completionCode();
    try {
      const saved = await env.DB.prepare(
        "INSERT OR IGNORE INTO completion_codes (completion_code, class_key) VALUES (?, ?)",
      ).bind(code, payload.classKey).run();
      if (saved.meta?.changes === 1) return json({ saved: true, code });
    } catch {
      return json({ error: "The completion code could not be saved." }, 503);
    }
  }
  return json({ error: "The completion code could not be generated." }, 503);
}

async function saveFeedback(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  const cohortKey = cohortForClassKey(payload?.classKey);
  if (!cohortKey) return json({ error: "Unknown class." }, 400);
  if (!isUuid(payload.feedbackId)
    || !validRating(payload.enjoyment)
    || !validRating(payload.clarity)
    || !validRating(payload.resultUsefulness)) {
    return json({ error: "Invalid feedback." }, 400);
  }
  try {
    const saved = await env.DB.prepare(`
      INSERT OR IGNORE INTO class_feedback (
        feedback_id, cohort_key, enjoyment, clarity, result_usefulness
      ) VALUES (?, ?, ?, ?, ?)
    `).bind(
      payload.feedbackId,
      cohortKey,
      payload.enjoyment,
      payload.clarity,
      payload.resultUsefulness,
    ).run();
    return json({ saved: true, duplicate: saved.meta?.changes === 0 });
  } catch {
    return json({ error: "The class feedback could not be saved." }, 503);
  }
}

async function savePilot(request, env) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 128_000) return json({ error: "Request is too large." }, 413);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  const cohortKey = cohortForClassKey(payload?.classKey);
  if (!cohortKey) return json({ error: "Unknown class." }, 400);
  if (!isUuid(payload.feedbackId)
    || !validRating(payload.enjoyment)
    || !validRating(payload.clarity)
    || !validRating(payload.resultUsefulness)) {
    return json({ error: "Invalid feedback." }, 400);
  }

  const consent = payload.consent === true;
  let result = null;
  let demographics = {};
  let generalHealth = null;
  if (consent) {
    if (!isUuid(payload.sessionId)) return json({ error: "Invalid session identifier." }, 400);
    if (!validateDslq(payload.dogSex, payload.behaviorAnswers, payload.healthDurations)) {
      return json({ error: "Invalid questionnaire answers." }, 400);
    }
    demographics = safeDemographics(payload.dogDemographics);
    result = calculateDslq(payload.dogSex, payload.behaviorAnswers, payload.healthDurations);
    const selectedHealthCodes = Object.entries(payload.healthDurations)
      .filter(([, value]) => value !== -1)
      .map(([code]) => Number(code));
    generalHealth = { Dog_Symptoms: selectedHealthCodes, gh_durations: payload.healthDurations };
  }

  try {
    const existing = await env.DB.prepare(
      "SELECT participant_code FROM class_feedback WHERE feedback_id = ? AND cohort_key = ? LIMIT 1",
    ).bind(payload.feedbackId, cohortKey).first();
    if (existing?.participant_code) return json({ saved: true, duplicate: true, code: existing.participant_code, result });
  } catch {
    return json({ error: "The class record could not be checked." }, 503);
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = completionCode();
    const statements = [
      env.DB.prepare(
        "INSERT INTO completion_codes (completion_code, class_key) VALUES (?, ?)",
      ).bind(code, payload.classKey),
      env.DB.prepare(`
        INSERT INTO class_feedback (
          feedback_id, cohort_key, enjoyment, clarity, result_usefulness, participant_code
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        payload.feedbackId,
        cohortKey,
        payload.enjoyment,
        payload.clarity,
        payload.resultUsefulness,
        code,
      ),
    ];

    if (consent) {
      statements.push(env.DB.prepare(`
        INSERT INTO dslq_sessions (
          session_id, app_version, consented_dog, dog_sex,
          dslq_chronic_score, interpretation_band, health_flag, visual_scale_pos,
          item_scores_json, behavior_answers_json, general_health_answers_json,
          research_choices_json, dog_demographics_json, cohort_key, participant_code
        ) VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        payload.sessionId,
        APP_VERSION,
        payload.dogSex,
        result.total,
        result.band,
        result.health,
        result.scalePos,
        JSON.stringify(result.itemScores),
        JSON.stringify(payload.behaviorAnswers),
        JSON.stringify(generalHealth),
        JSON.stringify({ share_questionnaire_data: true }),
        JSON.stringify(demographics),
        cohortKey,
        code,
      ));
    }

    try {
      await env.DB.batch(statements);
      return json({ saved: true, duplicate: false, code, result });
    } catch {
      try {
        const existing = await env.DB.prepare(
          "SELECT participant_code FROM class_feedback WHERE feedback_id = ? AND cohort_key = ? LIMIT 1",
        ).bind(payload.feedbackId, cohortKey).first();
        if (existing?.participant_code) return json({ saved: true, duplicate: true, code: existing.participant_code, result });
      } catch {
        return json({ error: "The class record could not be saved." }, 503);
      }
    }
  }
  return json({ error: "The participant code could not be generated." }, 503);
}

function safeDemographics(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const allowed = ["dog_name", "dog_age_years", "dog_age_months", "dog_lives_with_you", "dog_sex", "dog_neuter_status", "dog_breed", "dog_weight", "dogs_in_household", "other_animals", "other_animals_text"];
  return Object.fromEntries(allowed.filter((key) => value[key] !== undefined).map((key) => [key, typeof value[key] === "string" ? value[key].slice(0, 250) : value[key]]));
}

async function saveSession(request, env) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 128_000) return json({ error: "Request is too large." }, 413);
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  if (payload?.consent !== true) return json({ error: "Research consent is required for storage." }, 400);
  if (payload.classKey === "drudell") return json({ error: "Class responses must use the class submission route." }, 400);
  if (!isUuid(payload.sessionId)) return json({ error: "Invalid session identifier." }, 400);
  if (!validateDslq(payload.dogSex, payload.behaviorAnswers, payload.healthDurations)) return json({ error: "Invalid questionnaire answers." }, 400);

  const demographics = safeDemographics(payload.dogDemographics);
  const result = calculateDslq(payload.dogSex, payload.behaviorAnswers, payload.healthDurations);
  const cohortKey = cohortForClassKey(payload.classKey);
  const selectedHealthCodes = Object.entries(payload.healthDurations).filter(([, value]) => value !== -1).map(([code]) => Number(code));
  const generalHealth = { Dog_Symptoms: selectedHealthCodes, gh_durations: payload.healthDurations };
  const query = env.DB.prepare(`
    INSERT OR IGNORE INTO dslq_sessions (
      session_id, app_version, consented_dog, dog_sex,
      dslq_chronic_score, interpretation_band, health_flag, visual_scale_pos,
      item_scores_json, behavior_answers_json, general_health_answers_json,
      research_choices_json, dog_demographics_json, cohort_key
    ) VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    payload.sessionId,
    APP_VERSION,
    payload.dogSex,
    result.total,
    result.band,
    result.health,
    result.scalePos,
    JSON.stringify(result.itemScores),
    JSON.stringify(payload.behaviorAnswers),
    JSON.stringify(generalHealth),
    JSON.stringify({ share_questionnaire_data: true }),
    JSON.stringify(demographics),
    cohortKey,
  );

  try {
    const saved = await query.run();
    return json({ saved: true, duplicate: saved.meta?.changes === 0, result });
  } catch {
    return json({ error: "The research response could not be saved. Your result is still available." }, 503);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health" && request.method === "GET") {
      try {
        await env.DB.prepare("SELECT 1").first();
        return json({ ok: true, database: true, version: APP_VERSION });
      } catch {
        return json({ ok: false, database: false, version: APP_VERSION }, 503);
      }
    }
    if (url.pathname === "/api/sessions" && request.method === "POST") return saveSession(request, env);
    if (url.pathname === "/api/class-submissions" && request.method === "POST") return saveClassSubmission(request, env);
    if (url.pathname === "/api/completions" && request.method === "POST") return saveCompletion(request, env);
    if (url.pathname === "/api/feedback" && request.method === "POST") return saveFeedback(request, env);
    if (url.pathname === "/api/pilot" && request.method === "POST") return json({ error: "This class submission route has been retired. Please refresh the questionnaire." }, 410);
    if (url.pathname.startsWith("/api/")) return json({ error: "Not found." }, 404);
    return env.ASSETS.fetch(request);
  },
};
