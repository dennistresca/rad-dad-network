// Today's slate for the pick-entry form, from ESPN's public scoreboard.
// Same data source and pick-day window as the auto-grader, so what a host
// picks from here is exactly what the grader can find later.
import { inPickWindow, loadEvents } from "../../scripts/lib/pick-grader.mjs";
import { LEAGUES, pickDay } from "../_lib/pick-file.js";

// Cities with two teams in the same league need the full name to tell them apart.
const SHARED_CITIES = new Set(["Los Angeles", "LA", "New York", "Chicago"]);

function teamName(team, league) {
  if (league === "NCAAF") return team.shortDisplayName || team.location || team.displayName;
  return SHARED_CITIES.has(team.location) ? team.displayName : team.location || team.displayName;
}

export default async function handler(req, res) {
  const league = LEAGUES.find((l) => l === req.query?.league);
  if (!league) return res.status(400).json({ error: "Unknown league." });
  try {
    const day = pickDay();
    const events = (await loadEvents(league, day)).filter((e) => inPickWindow(e, day));
    const games = events
      .map((e) => {
        const away = e.competitors.find((c) => c.homeAway === "away");
        const home = e.competitors.find((c) => c.homeAway === "home");
        if (!away || !home) return null;
        return {
          id: e.id,
          startsAt: e.date,
          started: e.state !== "pre",
          label: `${teamName(away.team, league)} @ ${teamName(home.team, league)}`,
          away: away.team.shortDisplayName || away.team.location,
          home: home.team.shortDisplayName || home.team.location,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ day, games });
  } catch (err) {
    console.error("Games lookup error:", err);
    return res.status(502).json({ error: "Couldn't load today's games. You can still type the game in." });
  }
}
