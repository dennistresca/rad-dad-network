// Lets each host add or remove their own Daily Picks without going through
// Dennis. Protected by a per-host PIN (PICK_PIN_DENNIS / PICK_PIN_SHAUN /
// PICK_PIN_AARON). Changes are committed straight to src/data/pickOfTheDay.js,
// which redeploys the site.
import { createHash, timingSafeEqual } from "node:crypto";
import { HOSTS, LEAGUES, MAX_PICKS_PER_HOST, addPick, clean, pickDay, readCurrent, removePick } from "../_lib/pick-file.js";
import { githubConfigured, readPickFile, writePickFile } from "../_lib/github.js";

const digest = (s) => createHash("sha256").update(String(s)).digest();
const ODDS = /^[+-]\d{3,4}$/;

function pinOk(host, pin) {
  const expected = process.env[`PICK_PIN_${host.toUpperCase()}`];
  if (!expected || !pin) return false;
  return timingSafeEqual(digest(expected), digest(pin));
}

function view(text, day) {
  const current = readCurrent(text);
  // A file still on yesterday's date shows as an empty slate until the first new pick rolls it over.
  const picks = current.date === day ? current.picks : Object.fromEntries(HOSTS.map((h) => [h, []]));
  return { day, picks };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.setHeader("Cache-Control", "no-store");

  const body = req.body ?? {};
  const host = HOSTS.find((h) => h === body.host);
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";
  if (!host) return res.status(400).json({ error: "Choose who you are." });
  if (!githubConfigured() || !process.env[`PICK_PIN_${host.toUpperCase()}`]) {
    console.error("Pick submission is missing GITHUB_CONTENTS_TOKEN or a host PIN");
    return res.status(500).json({ error: "Pick submission isn't set up yet." });
  }
  if (!pinOk(host, pin)) {
    await new Promise((r) => setTimeout(r, 1000)); // slow down guessing
    return res.status(401).json({ error: "That PIN isn't right." });
  }

  const day = pickDay();

  try {
    if (body.action === "list") {
      const { text } = await readPickFile();
      return res.status(200).json(view(text, day));
    }

    let pick = null;
    if (body.action === "add") {
      const p = body.pick ?? {};
      const league = p.league === "Other" ? "Other" : LEAGUES.find((l) => l === p.league);
      const game = clean(p.game, 90);
      const selection = clean(p.selection, 80);
      const odds = clean(p.odds, 6);
      const note = clean(p.note, 100);
      if (!league) return res.status(400).json({ error: "Choose a league." });
      if (!game) return res.status(400).json({ error: "Choose a game." });
      if (!selection) return res.status(400).json({ error: "Enter your pick." });
      if (odds && !ODDS.test(odds)) return res.status(400).json({ error: "Odds look like -110 or +145." });
      pick = { league, game, selection, ...(odds && { odds }), ...(note && { note }) };
    } else if (body.action !== "remove") {
      return res.status(400).json({ error: "Unknown action." });
    }

    // Read, edit, write; retry if someone else saved in between.
    for (let attempt = 0; attempt < 4; attempt++) {
      const file = await readPickFile();
      let next;
      let message;
      if (body.action === "add") {
        const existing = view(file.text, day).picks[host];
        if (existing.length >= MAX_PICKS_PER_HOST) {
          return res.status(400).json({ error: `That's the limit of ${MAX_PICKS_PER_HOST} picks for the day.` });
        }
        if (existing.some((e) => e.game === pick.game && e.selection === pick.selection)) {
          return res.status(409).json({ error: "You already have that pick." });
        }
        const out = addPick(file.text, host, pick, day);
        next = out.text;
        message = `Add ${host}'s Daily Pick: ${pick.game}, ${pick.selection}${out.archived ? ` (archived the previous day; ${out.ungraded} still ungraded)` : ""}`;
      } else {
        next = removePick(file.text, host, Number(body.index), clean(body.game, 90), clean(body.selection, 80));
        message = `Remove ${host}'s Daily Pick: ${clean(body.game, 90)}, ${clean(body.selection, 80)}`;
      }
      if (await writePickFile(next, file.sha, message)) {
        return res.status(200).json({ success: true, ...view(next, day) });
      }
    }
    return res.status(409).json({ error: "The picks changed while you were saving. Please try again." });
  } catch (err) {
    console.error("Pick submission error:", err);
    const known = /already been graded|no longer exists|changed, refresh/.test(err.message);
    return res.status(known ? 409 : 500).json({ error: known ? err.message : "Something went wrong. Please try again." });
  }
}
