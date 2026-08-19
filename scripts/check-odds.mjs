// Dev tool (not part of the site build/runtime): looks up sportsbook odds
// (moneyline, spread, total) for a given league/date so picks can be
// posted with real odds instead of guessing. Run with:
//   node scripts/check-odds.mjs mlb 2026-08-19
//   node scripts/check-odds.mjs nfl 2025-11-09
//   node scripts/check-odds.mjs cfb 2025-11-08
// League defaults to "mlb", date defaults to today (machine's local date).
//
// Uses ESPN's public scoreboard + summary APIs — free, no API key.
// Unofficial (ESPN doesn't document or formally support it) but widely
// relied on and has been stable for years. Odds come from whichever
// sportsbook ESPN's "pickcenter" surfaces first (usually DraftKings) and
// are a snapshot at fetch time, not locked to any particular moment, so
// re-run close to when you're actually posting picks.
//
// This only prints a report; it does NOT write to pickOfTheDay.js.

const LEAGUE_PATHS = {
  mlb: "baseball/mlb",
  nfl: "football/nfl",
  cfb: "football/college-football",
};

const leagueArg = (process.argv[2] ?? "mlb").toLowerCase();
const dateArg = process.argv[3] ?? new Date().toISOString().slice(0, 10);

const leaguePath = LEAGUE_PATHS[leagueArg];
if (!leaguePath) {
  console.error(`Unknown league "${leagueArg}". Use "mlb", "nfl", or "cfb".`);
  process.exit(1);
}

const dateParam = dateArg.replaceAll("-", "");
const groupsParam = leagueArg === "cfb" ? "&groups=80" : ""; // 80 = FBS

const scoreboardUrl = `https://site.api.espn.com/apis/site/v2/sports/${leaguePath}/scoreboard?dates=${dateParam}${groupsParam}`;

const scoreboardResponse = await fetch(scoreboardUrl);
if (!scoreboardResponse.ok) {
  console.error(`Failed to fetch scoreboard: HTTP ${scoreboardResponse.status}`);
  process.exit(1);
}

const scoreboard = await scoreboardResponse.json();
const events = scoreboard.events ?? [];

if (events.length === 0) {
  console.log(`No ${leagueArg.toUpperCase()} games found for ${dateArg}.`);
  process.exit(0);
}

console.log(`${leagueArg.toUpperCase()} odds for ${dateArg}\n${"=".repeat(40)}\n`);

for (const event of events) {
  const competition = event.competitions[0];
  const [home, away] = competition.competitors[0].homeAway === "home"
    ? [competition.competitors[0], competition.competitors[1]]
    : [competition.competitors[1], competition.competitors[0]];

  console.log(`${away.team.displayName} @ ${home.team.displayName}`);
  console.log(`  Status: ${event.status.type.shortDetail}`);

  const summaryUrl = `https://site.api.espn.com/apis/site/v2/sports/${leaguePath}/summary?event=${event.id}`;
  const summaryResponse = await fetch(summaryUrl);
  if (!summaryResponse.ok) {
    console.log(`  (couldn't fetch odds: HTTP ${summaryResponse.status})\n`);
    continue;
  }

  const summary = await summaryResponse.json();
  const odds = summary.pickcenter?.[0];

  if (!odds) {
    console.log(`  (no odds posted for this game yet)\n`);
    continue;
  }

  console.log(`  Odds source: ${odds.provider?.name ?? "unknown"}`);
  if (odds.awayTeamOdds?.moneyLine != null) {
    console.log(`  Moneyline: ${away.team.displayName} ${odds.awayTeamOdds.moneyLine > 0 ? "+" : ""}${odds.awayTeamOdds.moneyLine}, ${home.team.displayName} ${odds.homeTeamOdds.moneyLine > 0 ? "+" : ""}${odds.homeTeamOdds.moneyLine}`);
  }
  // ESPN's "details" line reads correctly for football (e.g. "USC -38.5")
  // but is unreliable for MLB, where it sometimes just repeats a moneyline
  // number instead of the run line. Print both raw so nothing gets
  // mislabeled: cross-check `details` against the numeric spread/favorite
  // fields yourself before posting a spread/run-line pick.
  if (odds.details) {
    console.log(`  Line (per ESPN): ${odds.details}`);
  }
  if (odds.spread != null) {
    console.log(`  Spread number: ${odds.spread}`);
  }
  if (odds.overUnder != null) {
    console.log(`  Total: O/U ${odds.overUnder} (over ${odds.overOdds ?? "?"}, under ${odds.underOdds ?? "?"})`);
  }
  console.log("");
}
