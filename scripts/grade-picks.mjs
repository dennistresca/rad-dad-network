// Grades today's Daily Picks from final scores and writes the results into
// src/data/pickOfTheDay.js (win/loss badges plus each host's record). Run by
// the scheduled GitHub Action in .github/workflows/grade-picks.yml, or by hand:
//
//   node scripts/grade-picks.mjs --dry-run     # show what it would do
//   node scripts/grade-picks.mjs               # grade and write the file
//   node scripts/grade-picks.mjs --file path   # use another copy of the data file
//
// Phase 1 grades sides and totals only. Props, first-inning bets and anything
// the feed can't match cleanly are left alone and listed in the report.
// Safe to run repeatedly: picks that already have a result are skipped, so a
// second run only picks up games that finished since the first.
import { readFile, writeFile, appendFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { gradePick } from "./lib/pick-grader.mjs";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const dryRun = flag("--dry-run");
const fileArgIndex = args.indexOf("--file");
const DEFAULT_FILE = fileURLToPath(new URL("../src/data/pickOfTheDay.js", import.meta.url));
const dataFile = fileArgIndex >= 0 ? path.resolve(args[fileArgIndex + 1]) : DEFAULT_FILE;

// ---------- load ----------

const source = (await readFile(dataFile, "utf8")).replace(/\r\n/g, "\n");
const hadCrlf = (await readFile(dataFile, "utf8")).includes("\r\n");
const { pickOfTheDay } = await import(`${pathToFileURL(dataFile).href}?t=${Date.now()}`);

const pickDate = pickOfTheDay.date;
const report = { date: pickDate, graded: [], pending: [], review: [], unsupported: [], skipped: 0 };

// ---------- grade ----------

const decisions = []; // { host, index, result: "win"|"loss"|"push", detail }

for (const [host, picks] of Object.entries(pickOfTheDay.picks)) {
  for (let i = 0; i < picks.length; i++) {
    const pick = picks[i];
    if (pick.result || /push/i.test(pick.note ?? "")) {
      report.skipped++;
      continue;
    }
    const label = `${host}: ${pick.game ?? "?"} | ${pick.selection}`;
    const out = await gradePick(pick, pickDate);
    if (out.status === "graded") {
      decisions.push({ host, index: i, result: out.result, detail: out.detail, pick });
      report.graded.push({ label, result: out.result, detail: out.detail });
    } else if (out.status === "pending") {
      report.pending.push({ label, reason: out.reason });
    } else if (out.status === "review") {
      report.review.push({ label, reason: out.reason });
    } else {
      report.unsupported.push({ label, reason: out.reason });
    }
  }
}

// ---------- patch the data file ----------

function patchPickLines(text, decisionsList) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.startsWith("export const pickOfTheDay"));
  const recordsStart = lines.findIndex((l, i) => i > start && /^ {2}records:/.test(l));
  if (start < 0 || recordsStart < 0) throw new Error("Could not find the pickOfTheDay block");

  let host = null;
  let index = -1;
  for (let i = start; i < recordsStart; i++) {
    const h = lines[i].match(/^ {4}(Dennis|Shaun|Aaron): \[/);
    if (h) {
      host = h[1];
      index = -1;
      continue;
    }
    if (host && /^\s+\{ league:/.test(lines[i])) {
      index++;
      const d = decisionsList.find((x) => x.host === host && x.index === index);
      if (!d) continue;
      if (d.result === "push") {
        const note = `Push, ${d.detail}`;
        lines[i] = /note: "/.test(lines[i])
          ? lines[i].replace(/note: "([^"]*)"/, (_m, n) => `note: "${n}. ${note}"`)
          : lines[i].replace(/\s*\},\s*$/, `, note: "${note.replace(/"/g, "'")}" },`);
      } else {
        lines[i] = lines[i].replace(/\s*\},\s*$/, `, result: "${d.result}" },`);
      }
    }
    if (/^ {4}\],?\s*$/.test(lines[i])) host = null;
  }
  return lines;
}

function patchRecords(lines, decisionsList) {
  const recordsStart = lines.findIndex((l) => /^ {2}records:/.test(l));
  for (let i = recordsStart + 1; i < lines.length; i++) {
    if (/^ {2}\},?\s*$/.test(lines[i])) break;
    const m = lines[i].match(/^(\s+)(Dennis|Shaun|Aaron): \{(.*)\},\s*$/);
    if (!m) continue;
    const [, indent, host, inner] = m;
    const leagues = [];
    for (const lm of inner.matchAll(/(\w+): \{ wins: (\d+), losses: (\d+) \}/g)) {
      leagues.push({ league: lm[1], wins: Number(lm[2]), losses: Number(lm[3]) });
    }
    let changed = false;
    for (const d of decisionsList.filter((x) => x.host === host && x.result !== "push")) {
      let entry = leagues.find((l) => l.league === d.pick.league);
      if (!entry) {
        entry = { league: d.pick.league, wins: 0, losses: 0 };
        leagues.push(entry);
      }
      if (d.result === "win") entry.wins++;
      else entry.losses++;
      changed = true;
    }
    if (changed) {
      const rebuilt = leagues.map((l) => `${l.league}: { wins: ${l.wins}, losses: ${l.losses} }`).join(", ");
      lines[i] = `${indent}${host}: { ${rebuilt} },`;
    }
  }
  return lines;
}

if (decisions.length > 0 && !dryRun) {
  let lines = patchPickLines(source, decisions);
  lines = patchRecords(lines, decisions);
  let out = lines.join("\n");
  if (hadCrlf) out = out.replace(/\n/g, "\r\n");
  await writeFile(dataFile, out);
}

// ---------- report ----------

function section(title, items, fmt) {
  if (items.length === 0) return "";
  return `\n${title}\n${items.map((x) => `  - ${fmt(x)}`).join("\n")}\n`;
}

const text =
  `Daily Picks auto-grade for ${pickDate}${dryRun ? " (dry run, nothing written)" : ""}\n` +
  section("Graded", report.graded, (x) => `${x.result.toUpperCase()}  ${x.label}  [${x.detail}]`) +
  section("Not final yet (will retry on the next run)", report.pending, (x) => `${x.label}  (${x.reason})`) +
  section("Needs a person (could not match cleanly)", report.review, (x) => `${x.label}  (${x.reason})`) +
  section("Left for a person (props and other bets)", report.unsupported, (x) => `${x.label}`);

console.log(text);
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, "```\n" + text + "\n```\n");
}
if (process.env.GITHUB_OUTPUT) {
  await appendFile(
    process.env.GITHUB_OUTPUT,
    `graded=${report.graded.length}\nneeds_attention=${report.review.length + report.unsupported.length}\n`
  );
}

// Email the report when something happened or needs a person. Skipped
// quietly when the Resend settings aren't configured.
const shouldEmail =
  !dryRun && !flag("--no-email") && (report.graded.length > 0 || report.review.length > 0);
if (shouldEmail && process.env.RESEND_API_KEY && process.env.REVIEW_EMAIL_TO) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Rad Dad Network <picks@raddadnetwork.com>",
      to: process.env.REVIEW_EMAIL_TO.split(",").map((s) => s.trim()),
      subject: `Auto-grade: ${report.graded.length} graded, ${report.review.length + report.pending.length} open (${pickDate})`,
      text,
    }),
  });
  if (!res.ok) console.error(`Review email failed: HTTP ${res.status}`);
} else if (shouldEmail) {
  console.log("(Review email not sent: RESEND_API_KEY / REVIEW_EMAIL_TO not set.)");
}
