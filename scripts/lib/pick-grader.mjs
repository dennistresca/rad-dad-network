// Grades Daily Picks automatically from final scores. Phase 1 handles the
// bets that only need a final score: moneylines ("Seattle ML"), spreads
// ("Jacksonville State -3", "Brewers +1.5") and game totals ("UNDER 54.5").
// Anything else (player props, first-inning bets, series bets) is left
// pending and reported, never guessed at.
//
// Final scores come from ESPN's public scoreboard feed. It is unofficial,
// so every lookup is defensive: if a game can't be found or matched
// cleanly, the pick stays ungraded and shows up in the review report.

const SPORTS = {
  MLB: { path: "baseball/mlb", extra: "" },
  NFL: { path: "football/nfl", extra: "" },
  NHL: { path: "hockey/nhl", extra: "" },
  NBA: { path: "basketball/nba", extra: "" },
  // groups=80 is FBS, 81 is FCS; both are tried.
  NCAAF: { path: "football/college-football", extra: "&limit=400", groups: ["80", "81"] },
};

// ---------- parsing ----------

export function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[.'’()]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// "Seattle ML" -> ml, "Jacksonville State -3" -> spread, "UNDER 54.5" -> total.
// Returns null for anything else (props, NRFI/YRFI, etc.).
export function parseSelection(selection) {
  const s = String(selection ?? "").trim();
  let m = s.match(/^(over|under)\s+(\d+(?:\.\d+)?)$/i);
  if (m) return { type: "total", side: m[1].toLowerCase(), line: Number(m[2]) };
  m = s.match(/^(.+?)\s+ML$/i);
  if (m) return { type: "ml", team: m[1].trim() };
  m = s.match(/^(.+?)\s+([+-]\d+(?:\.\d+)?)$/);
  if (m) return { type: "spread", team: m[1].trim(), line: Number(m[2]) };
  return null;
}

// "Los Angeles Dodgers @ Milwaukee" / "West Virginia vs Virginia (Charlotte)"
export function parseGame(game) {
  const cleaned = String(game ?? "").replace(/\s*\([^)]*\)\s*$/, "");
  const parts = cleaned.split(/\s+(?:@|vs\.?|at)\s+/i).map((p) => p.trim());
  return parts.length === 2 && parts[0] && parts[1] ? parts : null;
}

// ---------- team matching ----------

function candidateNames(team) {
  return [team.displayName, team.shortDisplayName, team.location, team.name, team.abbreviation]
    .filter(Boolean)
    .map(normalize);
}

// How well a pick's team label fits an ESPN team: 3 = exact name, 2 = the
// label is the start of the full name ("Milwaukee" -> "Milwaukee Brewers"),
// 1 = the label starts with a short name ("chicago cubs" starts with
// "chicago"), 0 = no match.
export function teamScore(label, team) {
  const l = normalize(label);
  if (!l) return 0;
  let best = 0;
  for (const c of candidateNames(team)) {
    if (c === l) best = Math.max(best, 3);
    else if (c.startsWith(`${l} `)) best = Math.max(best, 2);
    else if (l.startsWith(`${c} `)) best = Math.max(best, 1);
  }
  return best;
}

export function teamMatches(label, team) {
  return teamScore(label, team) > 0;
}

// Finds the event whose two competitors match the two team names, in either order.
export function findEvent(events, teamA, teamB) {
  const hits = events.filter((e) => {
    const [c1, c2] = e.competitors;
    return (
      (teamMatches(teamA, c1.team) && teamMatches(teamB, c2.team)) ||
      (teamMatches(teamA, c2.team) && teamMatches(teamB, c1.team))
    );
  });
  return hits;
}

// ---------- ESPN ----------

const cache = new Map();

async function getJson(url) {
  if (cache.has(url)) return cache.get(url);
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      cache.set(url, json);
      return json;
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw new Error(`ESPN request failed (${url}): ${lastError?.message}`);
}

// Current DraftKings lines from the feed, when it has them: moneyline per side,
// spread (line and price) per side, and the total (line and prices). Used to
// prefill the pick-entry form; never used for grading.
function simplifyOdds(comp) {
  const o = comp.odds?.[0];
  if (!o) return null;
  const side = (x) => (x?.close ? { line: x.close.line, odds: x.close.odds } : null);
  const total = (x) => (x?.close ? { line: String(x.close.line ?? "").replace(/^[ou]/i, ""), odds: x.close.odds } : null);
  return {
    ml: { home: o.moneyline?.home?.close?.odds ?? null, away: o.moneyline?.away?.close?.odds ?? null },
    spread: { home: side(o.pointSpread?.home), away: side(o.pointSpread?.away) },
    total: { over: total(o.total?.over), under: total(o.total?.under) },
  };
}

function simplifyEvent(raw) {
  const comp = raw.competitions?.[0];
  if (!comp) return null;
  const status = raw.status?.type ?? comp.status?.type ?? {};
  return {
    id: raw.id,
    date: raw.date,
    completed: status.completed === true,
    state: status.state,
    statusName: status.name,
    detail: status.detail ?? status.shortDetail ?? "",
    odds: simplifyOdds(comp),
    competitors: comp.competitors.map((c) => ({
      homeAway: c.homeAway,
      score: c.score === undefined ? null : Number(c.score),
      team: c.team,
    })),
  };
}

function addDays(yyyymmdd, n) {
  const d = new Date(Date.UTC(+yyyymmdd.slice(0, 4), +yyyymmdd.slice(4, 6) - 1, +yyyymmdd.slice(6, 8)));
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

// All events for a league on the pick day and the day after (late games
// can land on the next calendar date).
export async function loadEvents(league, pickDate) {
  const cfg = SPORTS[league];
  if (!cfg) return [];
  const day = pickDate.replace(/-/g, "");
  const dates = [day, addDays(day, 1)];
  const seen = new Map();
  for (const date of dates) {
    const groupList = cfg.groups ?? [null];
    for (const group of groupList) {
      const url = `https://site.api.espn.com/apis/site/v2/sports/${cfg.path}/scoreboard?dates=${date}${cfg.extra}${group ? `&groups=${group}` : ""}`;
      const json = await getJson(url);
      for (const raw of json.events ?? []) {
        const e = simplifyEvent(raw);
        if (e && !seen.has(e.id)) seen.set(e.id, e);
      }
    }
  }
  return [...seen.values()];
}

// A pick day runs from about 6 a.m. Eastern to 6 a.m. Eastern the next
// morning, so a 10 p.m. Pacific first pitch still belongs to the day it was
// played, and the next game of a series is not mixed up with it. 10:00 UTC
// is 6 a.m. Eastern in daylight time and 5 a.m. in winter, close enough.
export function inPickWindow(event, pickDate) {
  const start = Date.parse(`${pickDate}T10:00:00Z`);
  const t = Date.parse(event.date);
  return t >= start && t < start + 24 * 60 * 60 * 1000;
}

// ---------- grading ----------

// Hockey shootouts: ESPN credits the winner with one extra goal. Books
// settle totals and puck lines without the shootout goal, so take it back.
function settlementScores(event, sport) {
  const [c1, c2] = event.competitors;
  let s1 = c1.score;
  let s2 = c2.score;
  if (sport === "NHL" && /\bSO\b|shootout/i.test(event.detail)) {
    if (s1 > s2) s1 -= 1;
    else if (s2 > s1) s2 -= 1;
  }
  return { s1, s2 };
}

function compare(value, line) {
  if (value > line) return 1;
  if (value < line) return -1;
  return 0;
}

// pick: { league, game, selection }. Returns { status, result?, detail, reason? }
// status: "graded" | "pending" | "review" | "unsupported"
export async function gradePick(pick, pickDate) {
  const parsed = parseSelection(pick.selection);
  if (!parsed) {
    return { status: "unsupported", reason: "Not a side or total (prop, first-inning bet, etc.): grade by hand" };
  }
  if (!SPORTS[pick.league]) {
    return { status: "unsupported", reason: `League ${pick.league} not supported yet` };
  }
  const teams = parseGame(pick.game);
  if (!teams) return { status: "review", reason: `Could not read the game "${pick.game}"` };

  let events;
  try {
    events = await loadEvents(pick.league, pickDate);
  } catch (err) {
    return { status: "review", reason: err.message };
  }

  const hits = findEvent(events, teams[0], teams[1]).filter((e) => inPickWindow(e, pickDate));
  if (hits.length === 0) return { status: "review", reason: `No ${pick.league} game found for "${pick.game}"` };
  if (hits.length > 1) return { status: "review", reason: `More than one game matches "${pick.game}"` };

  const event = hits[0];
  if (!event.completed) {
    return { status: "pending", reason: `Game not final yet (${event.detail || event.state})` };
  }
  if (event.competitors.some((c) => c.score === null || Number.isNaN(c.score))) {
    return { status: "review", reason: "Final score missing from the feed" };
  }

  const [c1, c2] = event.competitors;
  const { s1, s2 } = settlementScores(event, pick.league);
  const label = `${c1.team.abbreviation} ${c1.score} - ${c2.team.abbreviation} ${c2.score}${/\bSO\b|shootout/i.test(event.detail) ? " (SO)" : ""}`;

  if (parsed.type === "total") {
    const cmp = compare(s1 + s2, parsed.line);
    if (cmp === 0) return { status: "graded", result: "push", detail: `${label}, total ${s1 + s2}` };
    const over = cmp > 0;
    return {
      status: "graded",
      result: (parsed.side === "over") === over ? "win" : "loss",
      detail: `${label}, total ${s1 + s2}`,
    };
  }

  const sc1 = teamScore(parsed.team, c1.team);
  const sc2 = teamScore(parsed.team, c2.team);
  if (sc1 === sc2) {
    return { status: "review", reason: `Could not tell which team "${parsed.team}" is in ${pick.game}` };
  }
  const m1 = sc1 > sc2;
  const mine = m1 ? s1 : s2;
  const theirs = m1 ? s2 : s1;

  if (parsed.type === "ml") {
    // Moneylines settle on the real winner, shootouts and overtime included.
    const realMine = m1 ? c1.score : c2.score;
    const realTheirs = m1 ? c2.score : c1.score;
    if (realMine === realTheirs) return { status: "graded", result: "push", detail: label };
    return { status: "graded", result: realMine > realTheirs ? "win" : "loss", detail: label };
  }

  const cmp = compare(mine + parsed.line, theirs);
  if (cmp === 0) return { status: "graded", result: "push", detail: `${label}, landed exactly on ${parsed.line > 0 ? "+" : ""}${parsed.line}` };
  return { status: "graded", result: cmp > 0 ? "win" : "loss", detail: label };
}
