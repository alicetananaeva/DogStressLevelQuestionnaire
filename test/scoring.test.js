import test from "node:test";
import assert from "node:assert/strict";
import { BEHAVIOR_ITEMS, calculateDslq, getHealthItems, validateDslq } from "../public/scoring.js";

function allNo(dogSex = "Male") {
  const behavior = Object.fromEntries(BEHAVIOR_ITEMS.map((item) => [item.key, item.type === "protective" ? 2 : { main: 2 }]));
  const health = Object.fromEntries(getHealthItems(dogSex).map((item) => [item.code, -1]));
  return { behavior, health };
}

test("all required behavior and sex-filtered health items are validated", () => {
  const { behavior, health } = allNo("Male");
  assert.equal(validateDslq("Male", behavior, health), true);
  delete behavior.Panting;
  assert.equal(validateDslq("Male", behavior, health), false);
});

test("all symptoms absent and all protective behaviors absent score six", () => {
  const { behavior, health } = allNo("Male");
  const result = calculateDslq("Male", behavior, health);
  assert.equal(result.total, 6);
  assert.equal(result.band, "elevated");
  assert.equal(result.health, "none");
});

test("symptom formula exactly follows frequency × weekly weight / 9 for chronic items", () => {
  const { behavior, health } = allNo("Female");
  behavior.Stereotypic = { main: 1, frequency: 3, daysPerWeek: 7, duration: 2 };
  behavior.Panting = { main: 1, frequency: 2, daysPerWeek: 3, duration: 2 };
  behavior.Trembling = { main: 1, frequency: 3, daysPerWeek: 7, duration: 1 };
  const result = calculateDslq("Female", behavior, health);
  assert.equal(result.itemScores.Stereotypic, 1);
  assert.equal(result.itemScores.Panting, 4 / 9);
  assert.equal(result.itemScores.Trembling, 0);
  assert.equal(result.total, 7.4444);
  assert.equal(result.band, "elevated");
});

test("health flags remain separate from the chronic stress score", () => {
  const { behavior, health } = allNo("Unknown / prefer not to say");
  health[1] = 3;
  const result = calculateDslq("Unknown / prefer not to say", behavior, health);
  assert.equal(result.health, "chronic");
  assert.equal(result.total, 6);
});

test("boundary values preserve the Python <= band rules", () => {
  const { behavior, health } = allNo("Male");
  const base = calculateDslq("Male", behavior, health);
  assert.equal(base.band, "elevated");
  for (const item of BEHAVIOR_ITEMS.filter((entry) => entry.type === "protective")) behavior[item.key] = 1;
  assert.equal(calculateDslq("Male", behavior, health).band, "normal");
});
