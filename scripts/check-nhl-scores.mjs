// Dev tool (not part of the site build/runtime): looks up final NHL scores
// for a given date, same purpose as check-mlb-scores.mjs /
// check-football-scores.mjs / check-nba-scores.mjs. Run with:
//   node scripts/check-nhl-scores.mjs 2025-11-08
// Defaults to today (machine's local date) if no argument given.
//
// Uses the NHL's own public web API (api-web.nhle.com) — free, no API key,
// this is what NHL.com itself runs on.
//
// This only prints a report; it does NOT write to pickOfTheDay.js. Grading
// still means matching each pick's team/bet type against this report by
// hand (or having Claude do it) and confirming before pushing.

const dateArg = process.argv[2] ?? new Date().toISOString().slice(0, 10);

const url = `https://api-web.nhle.com/v1/score/${dateArg}`;

const response = await fetch(url);
if (!response.ok) {
  console.error(`Failed to fetch scores: HTTP ${response.status}`);
  process.exit(1);
}

const data = await response.json();
const games = data.games ?? [];

if (games.length === 0) {
  console.log(`No NHL games found for ${dateArg}.`);
  process.exit(0);
}

console.log(`NHL scores for ${dateArg}\n${"=".repeat(40)}\n`);

for (const game of games) {
  const { awayTeam, homeTeam, gameState } = game;
  const isFinal = gameState === "OFF" || gameState === "FINAL";

  console.log(`${awayTeam.name.default} @ ${homeTeam.name.default}`);
  console.log(`  Status: ${gameState}`);

  if (!isFinal) {
    console.log(`  (not final yet, skipping score details)\n`);
    continue;
  }

  const awayScore = awayTeam.score;
  const homeScore = homeTeam.score;
  const winner = awayScore > homeScore ? awayTeam.name.default : homeTeam.name.default;
  const margin = Math.abs(awayScore - homeScore);
  const totalGoals = awayScore + homeScore;

  console.log(`  Final: ${awayTeam.name.default} ${awayScore}, ${homeTeam.name.default} ${homeScore}`);
  console.log(`  Winner (ML): ${winner} (by ${margin})`);
  console.log(`  Total goals (for OVER/UNDER): ${totalGoals}`);
  console.log("");
}
