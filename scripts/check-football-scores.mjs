// Dev tool (not part of the site build/runtime): looks up final NFL or
// College Football scores for a given date, same purpose as
// check-mlb-scores.mjs. Run with:
//   node scripts/check-football-scores.mjs nfl 2025-11-09
//   node scripts/check-football-scores.mjs cfb 2025-11-08
// League defaults to "nfl", date defaults to today (machine's local date).
//
// Uses ESPN's public scoreboard API — free, no API key. Unofficial (ESPN
// doesn't document or formally support it) but widely relied on and has
// been stable for years.
//
// This only prints a report; it does NOT write to pickOfTheDay.js. Grading
// still means matching each pick's team/bet type against this report by
// hand (or having Claude do it) and confirming before pushing. For spread
// bets, use the margin/final score shown here against the line in the pick
// itself, there is no sportsbook line data in this report.

const LEAGUE_PATHS = {
  nfl: "football/nfl",
  cfb: "football/college-football",
};

const leagueArg = (process.argv[2] ?? "nfl").toLowerCase();
const dateArg = process.argv[3] ?? new Date().toISOString().slice(0, 10);

const leaguePath = LEAGUE_PATHS[leagueArg];
if (!leaguePath) {
  console.error(`Unknown league "${leagueArg}". Use "nfl" or "cfb".`);
  process.exit(1);
}

const dateParam = dateArg.replaceAll("-", "");
const groupsParam = leagueArg === "cfb" ? "&groups=80" : ""; // 80 = FBS

const url = `https://site.api.espn.com/apis/site/v2/sports/${leaguePath}/scoreboard?dates=${dateParam}${groupsParam}`;

const response = await fetch(url);
if (!response.ok) {
  console.error(`Failed to fetch scoreboard: HTTP ${response.status}`);
  process.exit(1);
}

const data = await response.json();
const events = data.events ?? [];

if (events.length === 0) {
  console.log(`No ${leagueArg.toUpperCase()} games found for ${dateArg}.`);
  process.exit(0);
}

console.log(`${leagueArg.toUpperCase()} scores for ${dateArg}\n${"=".repeat(40)}\n`);

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
