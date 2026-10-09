// Runs on Vercel Cron (see vercel.json "crons"). Emails that day's Daily
// Picks to the Resend audience, pulling straight from the same data file
// the site itself renders — there's no separate content source to keep
// in sync.
import { Resend } from "resend";
import { pickOfTheDay } from "../../src/data/pickOfTheDay.js";

const SITE_URL = "https://raddadnetwork.com";
const FROM_ADDRESS = "Rad Dad Network <picks@raddadnetwork.com>";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Mirrors the Daily Picks page: a host's overall record is the sum of their
// per-league records, and leagues with no graded picks yet are left out.
function renderRecord(leagueRecords) {
  const entries = Object.entries(leagueRecords ?? {}).filter(([, r]) => r.wins + r.losses > 0);
  if (entries.length === 0) return "";

  const overall = entries.reduce(
    (acc, [, r]) => ({ wins: acc.wins + r.wins, losses: acc.losses + r.losses }),
    { wins: 0, losses: 0 }
  );
  const byLeague = entries.map(([league, r]) => `${escapeHtml(league)} ${r.wins}-${r.losses}`).join(" · ");

  return `
      <p style="margin:0 0 14px 0;font-size:13px;color:#737373;">
        <span style="font-weight:700;color:#404040;">Daily Picks Record ${overall.wins}-${overall.losses}</span>
        <br />${byLeague}
      </p>`;
}

function renderHostSection(host, picks, leagueRecords) {
  if (!picks || picks.length === 0) return "";
  const rows = picks
    .map((pick) => {
      const game = pick.game ? `<p style="margin:0;font-size:13px;color:#737373;text-transform:uppercase;letter-spacing:0.03em;">${escapeHtml(pick.game)}</p>` : "";
      const odds = pick.odds ? ` <span style="color:#737373;">(${escapeHtml(pick.odds)})</span>` : "";
      return `
        <div style="margin:0 0 16px 0;">
          ${game}
          <p style="margin:2px 0 0 0;font-size:17px;font-weight:700;color:#111827;">${escapeHtml(pick.selection)}${odds}</p>
        </div>`;
    })
    .join("");

  return `
    <div style="margin:0 0 24px 0;padding:20px;border:1px solid #e5e5e5;border-radius:12px;">
      <h3 style="margin:0 0 4px 0;font-size:16px;font-weight:700;color:#111827;">${escapeHtml(host)}</h3>
      ${renderRecord(leagueRecords)}
      ${rows}
    </div>`;
}

function buildDigestHtml() {
  const formattedDate = dateFormatter.format(new Date(pickOfTheDay.date));
  const sections = Object.entries(pickOfTheDay.picks)
    .map(([host, picks]) => renderHostSection(host, picks, pickOfTheDay.records?.[host]))
    .join("");

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px 16px;">
      <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#737373;">Dancing With the Odds</p>
      <h1 style="margin:0 0 24px 0;font-size:26px;font-weight:800;color:#111827;">Daily Picks — ${formattedDate}</h1>
      ${sections}
      <p style="margin:32px 0 0 0;font-size:13px;color:#a3a3a3;">
        <a href="${SITE_URL}/shows/dancing-with-the-odds/pick-of-the-day" style="color:#a3a3a3;">See full records and previous picks →</a>
      </p>
    </div>`;
}

function hasAnyPicks() {
  return Object.values(pickOfTheDay.picks).some((picks) => picks.length > 0);
}

// Site dates are US local dates. The cron fires mid-morning Eastern, so
// today's date in America/New_York matches the date the hosts would have
// used for today's picks.
function todayInNewYork() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Never re-send a previous day's picks: if today's picks haven't been
  // uploaded yet, the data file still holds yesterday's, so skip.
  if (pickOfTheDay.date !== todayInNewYork()) {
    return res.status(200).json({
      skipped: true,
      reason: `Picks are dated ${pickOfTheDay.date}, not today (${todayInNewYork()})`,
    });
  }

  if (!hasAnyPicks()) {
    return res.status(200).json({ skipped: true, reason: "No picks submitted yet today" });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.error("Daily digest error: missing RESEND_API_KEY or RESEND_AUDIENCE_ID");
    return res.status(500).json({ error: "Email sending isn't configured" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data: broadcast, error: createError } = await resend.broadcasts.create({
      audienceId: process.env.RESEND_AUDIENCE_ID,
      from: FROM_ADDRESS,
      subject: `Daily Picks — ${dateFormatter.format(new Date(pickOfTheDay.date))}`,
      html: buildDigestHtml(),
    });
    if (createError) throw createError;

    const { error: sendError } = await resend.broadcasts.send(broadcast.id);
    if (sendError) throw sendError;

    return res.status(200).json({ success: true, broadcastId: broadcast.id });
  } catch (err) {
    console.error("Daily digest send error:", err);
    return res.status(500).json({ error: "Failed to send digest" });
  }
}
