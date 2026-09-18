import { readFile } from "node:fs/promises";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/prepare-supabase-import.mjs <supabase-export.json>");
  process.exit(1);
}

function objectValue(value, fallback = {}) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return typeof value === "object" ? value : fallback;
}

function sqlText(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

function sqlJson(value) {
  return sqlText(JSON.stringify(objectValue(value)));
}

const parsed = JSON.parse(await readFile(inputPath, "utf8"));
if (!Array.isArray(parsed)) throw new Error("The export must be a JSON array of dslq_sessions rows.");

const rows = parsed.filter((row) => row && (row.consented_dog === true || row.consented_dog === 1));

for (const row of rows) {
  const demographics = objectValue(row.dog_demographics);
  const dogSex = row.dog_sex || demographics.dog_sex || "Unknown / prefer not to say";
  const values = [
    sqlText(row.session_id),
    sqlText(row.created_at || new Date().toISOString()),
    sqlText(row.app_version || "supabase-import"),
    "1",
    sqlText(dogSex),
    Number(row.dslq_chronic_score || 0),
    sqlText(row.interpretation_band || "normal"),
    sqlText(row.health_flag || "none"),
    Number(row.visual_scale_pos || 0),
    sqlJson(row.item_scores),
    sqlJson(row.behavior_answers),
    sqlJson(row.general_health_answers),
    sqlJson(row.research_choices),
    sqlJson(demographics),
  ];
  console.log(`INSERT OR IGNORE INTO dslq_sessions (session_id, created_at, app_version, consented_dog, dog_sex, dslq_chronic_score, interpretation_band, health_flag, visual_scale_pos, item_scores_json, behavior_answers_json, general_health_answers_json, research_choices_json, dog_demographics_json) VALUES (${values.join(", ")});`);
}

console.error(`Prepared ${rows.length} consented row(s) from ${parsed.length} exported row(s).`);
