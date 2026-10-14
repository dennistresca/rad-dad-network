// Checks the automatic grader against every pick that was already graded by
// hand (pickHistory). Run with:  node scripts/test-grader.mjs
// Each supported pick is re-graded from ESPN's final scores and compared with
// the recorded result. Mismatches are either grader bugs or old data errors,
// so it is worth reading every one.
import { pickHistory } from "../src/data/pickOfTheDay.js";
import { gradePick, parseSelection } from "./lib/pick-grader.mjs";

let checked = 0;
let matched = 0;
const problems = [];
const unsupported = [];

for (const day of pickHistory) {
  for (const [host, picks] of Object.entries(day.picks)) {
    for (const pick of picks) {
      const expected = pick.result ?? (/push/i.test(pick.note ?? "") ? "push" : null);
      if (!expected) continue;
      if (!pick.game) continue; // older picks have no game text to match
      if (!parseSelection(pick.selection)) {
        unsupported.push(`${day.date} ${host}: ${pick.selection}`);
        continue;
      }
      checked++;
      const out = await gradePick(pick, day.date);
      if (out.status === "graded" && out.result === expected) {
        matched++;
      } else {
        problems.push(
          `${day.date} ${host} | ${pick.league} | ${pick.game} | ${pick.selection} | recorded=${expected} | auto=${out.status}${out.result ? `:${out.result}` : ""} ${out.detail ?? out.reason ?? ""}`
        );
      }
    }
  }
}

console.log(`Checked ${checked} side/total picks: ${matched} matched, ${problems.length} did not.`);
for (const p of problems) console.log("  MISMATCH:", p);
console.log(`Skipped ${unsupported.length} picks that are props or other bets the grader leaves to a person.`);
