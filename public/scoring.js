export const APP_VERSION = "dslq-cloudflare-4.2.1";

export const BEHAVIOR_ITEMS = [
  { number: 1, key: "Stereotypic", type: "symptom", text: "My dog has engaged in stereotypic (repetitive) movements for 10 minutes or more at a time. For example, chasing their own tail, pacing back and forth or wandering in circles, excessive licking or sucking on toys or other objects (outside of play), excessive grooming that leaves wounds on skin, or something similar." },
  { number: 2, key: "Panting", type: "symptom", text: "My dog breathes heavily (panting) at times that seem unrelated to exertion/exercise or hot weather." },
  { number: 3, key: "Dog_Play_FamHum", type: "protective", text: "My dog engages in social play or other positive interactions with most familiar humans without signs of anxiety, fear or aggression." },
  { number: 4, key: "Trembling", type: "symptom", text: "My dog trembles or appears to have over-tight muscles." },
  { number: 5, key: "Concentration", type: "symptom", text: "My dog has a difficult time staying focused on one task during activities (e.g. during training sessions, when attempting to problem solve or during play)." },
  { number: 6, key: "Itching", type: "symptom", text: "My dog seems to itch, lick or chew on its paws, tail or other parts of its body more frequently than other dogs and/or has caused bald spots or sores from excessive grooming behavior." },
  { number: 7, key: "Improper_Urination", type: "symptom", text: "My dog urinates (pees) inside the home (not on potty mats or in a litter box)." },
  { number: 8, key: "Improper_Defecation", type: "symptom", text: "My dog defecates (poops) inside the home (not on potty mats or in a litter box)." },
  { number: 9, key: "Restless", type: "symptom", text: "My dog is restless (seems to have difficulty finding or staying in a comfortable resting position)." },
  { number: 10, key: "Dog_Play_Dogs", type: "protective", text: "My dog engages in social play and/or other positive interactions with most other dogs without signs of anxiety, fear or aggression." },
  { number: 11, key: "Anxiety", type: "symptom", text: "My dog gets anxious." },
  { number: 12, key: "Air_Biting", type: "symptom", text: "My dog bites or snaps at the air (when there is nothing visible to snap at)." },
  { number: 13, key: "Excitement", type: "symptom", text: "Once my dog gets excited, it takes a long time to calm down (e.g. more than 10 minutes)." },
  { number: 14, key: "Mounting", type: "symptom", text: "My dog tries to mount on people, objects or other animals (outside of mating/breeding)." },
  { number: 15, key: "Aggressiveness", type: "symptom", text: "My dog suddenly reacts aggressively towards people or dogs." },
  { number: 16, key: "Dog_Play_General", type: "protective", text: "My dog loves to play." },
  { number: 17, key: "Appetite_Loss", type: "symptom", text: "There are times when my dog refuses to eat or take favorite treats." },
  { number: 18, key: "Shadow_Hunting", type: "symptom", text: "My dog hunts reflections and shadows." },
  { number: 19, key: "Leash_Biting", type: "symptom", text: "My dog bites or chews at their leash when walking." },
  { number: 20, key: "Chewing", type: "symptom", text: "My dog eats or chews almost everything, including non-edible items." },
  { number: 21, key: "Dog_New_Places", type: "protective", text: "My dog feels confident when in new places." },
  { number: 22, key: "Vocalization", type: "symptom", text: "There are times when my dog desperately barks, whines or squeals." },
  { number: 23, key: "Grass_Eating", type: "symptom", text: "There are times where my dog excessively eats grass during walks." },
  { number: 24, key: "Sound_Sensitivity", type: "symptom", text: "My dog seems to wake up from any tiny sound." },
  { number: 25, key: "Freezing", type: "symptom", text: "My dog freezes (holds still/stops moving) in challenging situations." },
  { number: 26, key: "Strange_Behavior", type: "symptom", text: "At times, my dog acts strangely or unpredictably in familiar situations." },
  { number: 27, key: "Contact_Refuses", type: "symptom", text: "At times, my dog refuses physical contact with familiar people or dogs (even if the dog liked to have contact with them before)." },
  { number: 28, key: "Destroying", type: "symptom", text: "My dog has damaged floors, walls or furniture (e.g. chewing, scratching, digging indoors)." },
  { number: 29, key: "Shaking", type: "symptom", text: "My dog shakes their body (as if shaking off water) when they are not wet." },
  { number: 30, key: "Head_Away", type: "symptom", text: "My dog turns their head away and/or squints when confronting something novel or that might make them uncomfortable (not from bright lights)." },
  { number: 31, key: "Dog_New_Dogs", type: "protective", text: "My dog interacts with unfamiliar dogs with interest and in a positive manner." },
  { number: 32, key: "Yawning", type: "symptom", text: "My dog yawns at unusual times/with no other signs of being tired." },
  { number: 33, key: "Licking", type: "symptom", text: "My dog licks their mouth at unusual times (e.g. at times outside of eating or drinking)." },
  { number: 34, key: "Salivation", type: "symptom", text: "My dog seems to drool more than most dogs, or drools when in new or uncomfortable situations (in the absence of food or treats)." },
  { number: 35, key: "Depression", type: "symptom", text: "My dog shows signs of depression-like behavior (low energy, avoids social interactions, shows little interest in activities they used to enjoy)." },
  { number: 36, key: "Sleep_Poorly", type: "symptom", text: "My dog sleeps poorly (for example, waking up often at night, restless during sleep, trouble falling asleep, or less sleep than you would typically expect overall)." },
  { number: 37, key: "Dog_New_Objects", type: "protective", text: "My dog is eager to interact with and explore new objects with little to no signs of hesitation or fear." },
];

export const FREQUENCY_OPTIONS = [
  [1, "Sometimes"], [2, "Frequently"], [3, "Constantly"],
];
export const DAYS_OPTIONS = [
  [1, "1 day"], [2, "2 days"], [3, "3 days"], [4, "4 days"], [5, "5 days"],
  [6, "6 days"], [7, "7 days"], [8, "It happens less than once a week"], [9, "I do not know / it varies"],
];
export const DURATION_OPTIONS = [
  [1, "This started less than two weeks ago"], [2, "This started more than two weeks ago"],
];
export const HEALTH_DURATION_OPTIONS = [
  [1, "Less than a week ago"], [2, "Less than a month ago"], [3, "Over a month ago"], [4, "It varies / Other"],
];

const HEALTH_ITEMS = [
  { code: 1, text: "Quality of coat has become worse (dull, faded, falls out, dandruff, other)" },
  { code: 2, text: "Significantly lost weight" },
  { code: 3, text: "Bad body or breath smell" },
  { code: 4, text: "Problems with stomach (constipation, diarrhea, vomiting, other)" },
  { code: 5, sex: "female", text: "Unusual behavior during heat or changes in heat frequency" },
  { code: 6, sex: "male", text: "Becoming visibly excited without the presence of female dogs in heat or their scent" },
];

export const THRESHOLDS = { normalUpper: 5.6, elevatedUpper: 7.98, maxObserved: 10.11 };
const FW_WEIGHT = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 3, 8: 0, 9: 1 };

export function getHealthItems(dogSex) {
  const sex = String(dogSex || "").toLowerCase();
  if (sex === "male") return HEALTH_ITEMS.filter((item) => item.sex !== "female");
  if (sex === "female") return HEALTH_ITEMS.filter((item) => item.sex !== "male");
  return [...HEALTH_ITEMS];
}

function isCode(value, allowed) {
  return Number.isInteger(value) && allowed.includes(value);
}

export function validateDslq(dogSex, behaviorAnswers, healthDurations) {
  if (!["Male", "Female", "Unknown / prefer not to say"].includes(dogSex)) return false;
  if (!behaviorAnswers || typeof behaviorAnswers !== "object" || Array.isArray(behaviorAnswers)) return false;
  if (Object.keys(behaviorAnswers).length !== BEHAVIOR_ITEMS.length) return false;

  for (const item of BEHAVIOR_ITEMS) {
    const answer = behaviorAnswers[item.key];
    if (item.type === "protective") {
      if (!isCode(answer, [1, 2])) return false;
    } else {
      if (!answer || typeof answer !== "object" || !isCode(answer.main, [1, 2])) return false;
      if (answer.main === 1 && (!isCode(answer.frequency, [1, 2, 3]) || !isCode(answer.daysPerWeek, [1, 2, 3, 4, 5, 6, 7, 8, 9]) || !isCode(answer.duration, [1, 2]))) return false;
    }
  }

  const healthItems = getHealthItems(dogSex);
  if (!healthDurations || typeof healthDurations !== "object" || Object.keys(healthDurations).length !== healthItems.length) return false;
  return healthItems.every((item) => isCode(healthDurations[item.code], [-1, 1, 2, 3]));
}

function scoreSymptom(answer) {
  if (answer.main !== 1 || answer.duration !== 2) return 0;
  const frequency = [1, 2, 3].includes(answer.frequency) ? answer.frequency : 1;
  return (frequency * (FW_WEIGHT[answer.daysPerWeek] ?? 1)) / 9;
}

function bandFor(score) {
  if (score > THRESHOLDS.maxObserved) return "ultra_high";
  if (score > THRESHOLDS.elevatedUpper) return "high";
  if (score > THRESHOLDS.normalUpper) return "elevated";
  return "normal";
}

function healthFlag(healthDurations) {
  const positive = Object.values(healthDurations).filter((value) => value !== -1);
  if (!positive.length) return "none";
  if (positive.some((value) => value === 3)) return "chronic";
  return "reported";
}

export function calculateDslq(dogSex, behaviorAnswers, healthDurations) {
  if (!validateDslq(dogSex, behaviorAnswers, healthDurations)) throw new Error("Invalid or incomplete DSLQ responses.");
  const itemScores = {};
  let total = 0;
  for (const item of BEHAVIOR_ITEMS) {
    const answer = behaviorAnswers[item.key];
    const score = item.type === "protective" ? (answer === 2 ? 1 : 0) : scoreSymptom(answer);
    itemScores[item.key] = score;
    total += score;
  }
  total = Math.round(total * 10_000) / 10_000;
  return {
    total,
    band: bandFor(total),
    scalePos: total > THRESHOLDS.maxObserved ? 1 : Math.max(0, Math.min(1, total / THRESHOLDS.maxObserved)),
    itemScores,
    health: healthFlag(healthDurations),
  };
}

export function normalizeHealthDuration(value) {
  return Number(value) === 4 ? 1 : Number(value);
}
