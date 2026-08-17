// Dev tool (not part of the site build/runtime): looks up final MLB scores
// for a given date so picks on the Daily Picks page can be graded without
// manually searching for each score. Run with:
//   node scripts/check-mlb-scores.mjs 2026-08-16
// Defaults to today (in the machine's local date) if no argument given.
//
// Uses MLB's public Stats API (statsapi.mlb.com) — free, no API key.
// This only prints a report; it does NOT write to pickOfTheDay.js. Grading
// still means matching each pick's team/bet type against this report by
// hand (or having Claude do it) and confirming before pushing.

const date = process.argv[2] ?? new Date().toISOString().slice(0, 10);

const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=linescore`;

const response = await fetch(url);
if (!response.ok) {
  console.error(`Failed to fetch schedule: HTTP ${response.status}`);
  process.exit(1);
}

const data = await response.json();
const games = data.dates?.[0]?.games ?? [];

if (games.length === 0) {
  console.log(`No MLB games found for ${date}.`);
  process.exit(0);
}

console.log(`MLB scores for ${date}\n${"=".repeat(40)}\n`);

for (const game of games) {
  const { away, home } = game.teams;
  const status = game.status.detailedState;

  console.log(`${away.team.name} @ ${home.team.name}`);
  console.log(`  Status: ${status}`);

  if (status !== "Final") {
    console.log(`  (not final yet, skipping score details)\n`);
    continue;
  }

  const awayScore = away.score;
  const homeScore = home.score;
  const winner = away.isWinner ? away.team.name : home.team.name;
  const totalRuns = awayScore + homeScore;

  const firstInning = game.linescore?.innings?.[0];
  const firstInningRuns = firstInning ? firstInning.away.runs + firstInning.home.runs : null;

  console.log(`  Final: ${away.team.name} ${awayScore}, ${home.team.name} ${homeScore}`);
  console.log(`  Winner (ML): ${winner}`);
  console.log(`  Total runs (for OVER/UNDER): ${totalRuns}`);
  if (firstInningRuns !== null) {
    console.log(
      `  First inning: ${firstInningRuns} run(s) -> ${firstInningRuns > 0 ? "YRFI" : "NRFI"}`
    );
  }
  console.log("");
}
