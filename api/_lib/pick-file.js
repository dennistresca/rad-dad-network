// Text-level edits to src/data/pickOfTheDay.js for the pick-submission form:
// add a pick, remove a pick, and roll the day over (archive yesterday's
// entry into `pickHistory` and start a fresh one). Works on the file's
// source text so every other line, comment and record stays untouched.
// Pure functions, no network, so they can be tested against a copy of the file.

export const HOSTS = ["Dennis", "Shaun", "Aaron"];
export const LEAGUES = ["MLB", "NFL", "NHL", "NBA", "NCAAF"];
export const MAX_PICKS_PER_HOST = 6;

// A pick "day" runs from 6 a.m. Eastern to 6 a.m. Eastern, the same window
// the auto-grader uses, so a pick sent just after midnight still belongs to
// the games being played that evening and the 1:30 a.m. grading run still
// finds yesterday's picks in place.
export function pickDay(now = new Date()) {
  const shifted = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(shifted);
}

const STR = `"((?:[^"\\\\]|\\\\.)*)"`;

function field(line, name) {
  const m = line.match(new RegExp(`\\b${name}: ${STR}`));
  return m ? JSON.parse(`"${m[1]}"`) : undefined;
}

// Strip control characters and collapse whitespace so one pick is always one line.
export function clean(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function pickLine(pick) {
  const parts = [
    `league: ${JSON.stringify(pick.league)}`,
    `game: ${JSON.stringify(pick.game)}`,
    `selection: ${JSON.stringify(pick.selection)}`,
  ];
  if (pick.odds) parts.push(`odds: ${JSON.stringify(pick.odds)}`);
  if (pick.note) parts.push(`note: ${JSON.stringify(pick.note)}`);
  return `{ ${parts.join(", ")} }`;
}

function split(text) {
  const crlf = text.includes("\r\n");
  return { lines: text.replace(/\r\n/g, "\n").split("\n"), crlf };
}

function join(lines, crlf) {
  const out = lines.join("\n");
  return crlf ? out.replace(/\n/g, "\r\n") : out;
}

// Line numbers of the current-day block: `export const pickOfTheDay` up to
// its `records:` line, plus the `date:` line.
function currentBlock(lines) {
  const start = lines.findIndex((l) => l.startsWith("export const pickOfTheDay"));
  const dateLine = lines.findIndex((l, i) => i > start && /^ {2}date: "/.test(l));
  const picksStart = lines.findIndex((l, i) => i > start && /^ {2}picks: \{/.test(l));
  const recordsStart = lines.findIndex((l, i) => i > start && /^ {2}records:/.test(l));
  if ([start, dateLine, picksStart, recordsStart].some((n) => n < 0)) {
    throw new Error("Could not find the pickOfTheDay block");
  }
  // The picks object closes with `  },` just before `records:`.
  let picksEnd = recordsStart - 1;
  while (picksEnd > picksStart && !/^ {2}\},?\s*$/.test(lines[picksEnd])) picksEnd--;
  return { start, dateLine, picksStart, picksEnd, recordsStart };
}

// { date, picks: { Dennis: [{ index, league, game, selection, odds, note, result }], ... } }
export function readCurrent(text) {
  const { lines } = split(text);
  const b = currentBlock(lines);
  const date = lines[b.dateLine].match(/date: "([^"]+)"/)[1];
  const picks = Object.fromEntries(HOSTS.map((h) => [h, []]));
  let host = null;
  for (let i = b.picksStart + 1; i < b.picksEnd; i++) {
    const h = lines[i].match(/^ {4}(Dennis|Shaun|Aaron): \[/);
    if (h) {
      host = h[1];
      continue;
    }
    if (host && /^\s+\{ league:/.test(lines[i])) {
      picks[host].push({
        index: picks[host].length,
        league: field(lines[i], "league"),
        game: field(lines[i], "game"),
        selection: field(lines[i], "selection"),
        odds: field(lines[i], "odds"),
        note: field(lines[i], "note"),
        result: field(lines[i], "result"),
      });
    }
    if (/^ {4}\],?\s*$/.test(lines[i])) host = null;
  }
  return { date, picks };
}

// Moves the current day's picks into `pickHistory` (newest first) and resets
// the current day. Does nothing when the file is already on `day`.
// Returns { text, archived, ungraded } so callers can report what happened.
export function rollOver(text, day) {
  const { lines, crlf } = split(text);
  const b = currentBlock(lines);
  const oldDate = lines[b.dateLine].match(/date: "([^"]+)"/)[1];
  if (oldDate === day) return { text, archived: false, ungraded: 0 };

  const current = readCurrent(text);
  const total = HOSTS.reduce((n, h) => n + current.picks[h].length, 0);
  const ungraded = HOSTS.reduce(
    (n, h) => n + current.picks[h].filter((p) => !p.result && !/push/i.test(p.note ?? "")).length,
    0
  );

  let out = lines;
  if (total > 0) {
    const body = lines.slice(b.picksStart + 1, b.picksEnd).map((l) => (l ? `  ${l}` : l));
    const entry = [`  {`, `    date: "${oldDate}",`, `    picks: {`, ...body, `    },`, `  },`];
    const histIdx = out.findIndex((l) => l.startsWith("export const pickHistory = ["));
    if (histIdx < 0) throw new Error("Could not find pickHistory");
    out = [...out.slice(0, histIdx + 1), ...entry, ...out.slice(histIdx + 1)];
  }

  // Recompute the block (the history insert is below it, so line numbers above are unchanged).
  out[b.dateLine] = `  date: "${day}",`;
  const fresh = HOSTS.map((h) => `    ${h}: [],`);
  out = [...out.slice(0, b.picksStart + 1), ...fresh, ...out.slice(b.picksEnd)];
  return { text: join(out, crlf), archived: total > 0, ungraded };
}

// Adds a pick to a host's list for `day`, rolling the day over first if needed.
export function addPick(text, host, pick, day) {
  if (!HOSTS.includes(host)) throw new Error("Unknown host");
  const rolled = rollOver(text, day);
  const { lines, crlf } = split(rolled.text);
  const b = currentBlock(lines);

  const hostIdx = lines.findIndex((l, i) => i > b.picksStart && i < b.picksEnd && l.startsWith(`    ${host}: [`));
  if (hostIdx < 0) throw new Error(`Could not find ${host}'s picks`);
  const newLine = `      ${pickLine(pick)},`;

  if (/\[\],?\s*$/.test(lines[hostIdx])) {
    lines.splice(hostIdx, 1, `    ${host}: [`, newLine, `    ],`);
  } else {
    let close = hostIdx + 1;
    while (!/^ {4}\],?\s*$/.test(lines[close])) close++;
    lines.splice(close, 0, newLine);
  }
  return { text: join(lines, crlf), archived: rolled.archived, ungraded: rolled.ungraded };
}

// Removes one ungraded pick, identified by its position and confirmed by its game and selection.
export function removePick(text, host, index, game, selection) {
  const { lines, crlf } = split(text);
  const b = currentBlock(lines);
  const hostIdx = lines.findIndex((l, i) => i > b.picksStart && i < b.picksEnd && l.startsWith(`    ${host}: [`));
  if (hostIdx < 0) throw new Error(`Could not find ${host}'s picks`);

  let n = -1;
  let target = -1;
  let close = hostIdx + 1;
  for (; !/^ {4}\],?\s*$/.test(lines[close]) && close < b.picksEnd; close++) {
    if (/^\s+\{ league:/.test(lines[close])) {
      n++;
      if (n === index) target = close;
    }
  }
  if (target < 0) throw new Error("That pick no longer exists");
  if (field(lines[target], "game") !== game || field(lines[target], "selection") !== selection) {
    throw new Error("That pick changed, refresh and try again");
  }
  if (field(lines[target], "result") || /note: "[^"]*\bPush\b/.test(lines[target])) {
    throw new Error("That pick has already been graded");
  }
  lines.splice(target, 1);
  // Collapse an emptied array back to `Host: [],`.
  const stillHas = lines.slice(hostIdx + 1, close - 1).some((l) => /^\s+\{ league:/.test(l));
  if (!stillHas) lines.splice(hostIdx, 2, `    ${host}: [],`);
  return join(lines, crlf);
}
