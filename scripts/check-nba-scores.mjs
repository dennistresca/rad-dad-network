// Dev tool (not part of the site build/runtime): looks up final NBA scores
// for a given date, same purpose as check-mlb-scores.mjs /
// check-football-scores.mjs. Run with:
//   node scripts/check-nba-scores.mjs 2025-11-08
// Defaults to today (machine's local date) if no argument given.
//
// Uses ESPN's public scoreboard API — free, no API key. Unofficial but
// widely relied on and stable for years.
//
// This only prints a report; it does NOT write to pickOfTheDay.js. Grading
// still means matching each pick's team/bet type against this report by
// hand (or having Claude do it) and confirming before pushing.

const dateArg = process.argv[2] ?? new Date().toISOString().slice(0, 10);
const dateParam = dateArg.replaceAll("-", "");

const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateParam}`;

const response = await fetch(url);
if (!response.ok) {
  console.error(`Failed to fetch scoreboard: HTTP ${response.status}`);
  process.exit(1);
}

const data = await response.json();
const events = data.events ?? [];

if (events.length === 0) {
  console.log(`No NBA games found for ${dateArg}.`);
  process.exit(0);
}

console.log(`NBA scores for ${dateArg}\n${"=".repeat(40)}\n`);

for (const event of events) {
  const competition = event.competitions[0];
  const status = event.status.type.name;
  const [home, away] = competition.competitors[0].homeAway === "home"
    ? [competition.competitors[0], competition.competitors[1]]
    : [competition.competitors[1], competition.competitors[0]];

  console.log(`${away.team.displayName} @ ${home.team.displayName}`);
  console.log(`  Status: ${event.status.type.shortDetail}`);

  if (status !== "STATUS_FINAL") {
    console.log(`  (not final yet, skipping score details)\n`);
    continue;
  }

  const awayScore = Number(away.score);
  const homeScore = Number(home.score);
  const winner = away.winner ? away.team.displayName : home.team.displayName;
  const margin = Math.abs(awayScore - homeScore);
  const totalPoints = awayScore + homeScore;

  console.log(`  Final: ${away.team.displayName} ${awayScore}, ${home.team.displayName} ${homeScore}`);
  console.log(`  Winner (ML): ${winner} (by ${margin})`);
  console.log(`  Total points (for OVER/UNDER): ${totalPoints}`);
  console.log("");
}
