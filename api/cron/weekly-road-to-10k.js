// Runs on Vercel Cron (see vercel.json "crons"), Friday mornings. Emails
// that week's official Road to $10K bets (the most recent weeklyBets
// entry) to the same Resend audience as the Daily Picks digest — same
// subscriber list, no separate opt-in.
import { Resend } from "resend";
import { bankrollTracker } from "../../src/data/bankrollTracker.js";

const SITE_URL = "https://raddadnetwork.com";
const FROM_ADDRESS = "Rad Dad Network <picks@raddadnetwork.com>";

// Only send if the newest weeklyBets entry is dated within this many
// calendar days of today. The cron fires every 7 days, so anything 7+ days
// old is last week's episode — skip rather than re-mail it. Upload the new
// episode's bets before Friday morning or no email goes out.
const MAX_ENTRY_AGE_DAYS = 6;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isRecent(dateString) {
  const entryDay = new Date(dateString).getTime();
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const ageDays = Math.round((todayUtc - entryDay) / (24 * 60 * 60 * 1000));
  return ageDays >= 0 && ageDays <= MAX_ENTRY_AGE_DAYS;
}

function renderBetRow(bet) {
  const game = bet.game
    ? `<p style="margin:0;font-size:13px;color:#737373;text-transform:uppercase;letter-spacing:0.03em;">${escapeHtml(bet.game)}</p>`
    : "";
  const category = bet.category
    ? `<p style="margin:0 0 2px 0;font-size:11px;font-weight:800;color:#DC2626;text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(bet.category)}</p>`
    : "";
  const odds = bet.odds ? ` <span style="color:#737373;">(${escapeHtml(bet.odds)})</span>` : "";

  return `
    <div style="margin:0 0 16px 0;">
      ${category}
      ${game}
      <p style="margin:2px 0 0 0;font-size:17px;font-weight:700;color:#111827;">${escapeHtml(bet.selection)}${odds}</p>
    </div>`;
}

function buildDigestHtml(currentWeek) {
  const { currentBankroll, goalBankroll, records } = bankrollTracker;
  const betsHtml = currentWeek.bets.map(renderBetRow).join("");

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px 16px;">
      <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#737373;">Dancing With the Odds</p>
      <h1 style="margin:0 0 4px 0;font-size:26px;font-weight:800;color:#111827;">Road to $10K — ${escapeHtml(currentWeek.episode)}</h1>
      <p style="margin:0 0 24px 0;font-size:15px;color:#737373;">
        Bankroll: <strong style="color:#111827;">${currencyFormatter.format(currentBankroll)}</strong> of ${currencyFormatter.format(goalBankroll)}
        &nbsp;·&nbsp; Season record: <strong style="color:#111827;">${records.overall.wins}-${records.overall.losses}</strong>
      </p>
      <div style="padding:20px;border:1px solid #e5e5e5;border-radius:12px;">
        ${betsHtml}
      </div>
      <p style="margin:32px 0 0 0;font-size:13px;color:#a3a3a3;">
        <a href="${SITE_URL}/shows/dancing-with-the-odds/road-to-10k" style="color:#a3a3a3;">See full bankroll and betting history →</a>
      </p>
    </div>`;
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const [currentWeek] = bankrollTracker.weeklyBets;
  if (!currentWeek || !isRecent(currentWeek.date)) {
    return res.status(200).json({ skipped: true, reason: "No new episode bets this week" });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.error("Weekly Road to $10K error: missing RESEND_API_KEY or RESEND_AUDIENCE_ID");
    return res.status(500).json({ error: "Email sending isn't configured" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data: broadcast, error: createError } = await resend.broadcasts.create({
      audienceId: process.env.RESEND_AUDIENCE_ID,
      from: FROM_ADDRESS,
      subject: `Road to $10K — ${currentWeek.episode}`,
      html: buildDigestHtml(currentWeek),
    });
    if (createError) throw createError;

    const { error: sendError } = await resend.broadcasts.send(broadcast.id);
    if (sendError) throw sendError;

    return res.status(200).json({ success: true, broadcastId: broadcast.id });
  } catch (err) {
    console.error("Weekly Road to $10K send error:", err);
    return res.status(500).json({ error: "Failed to send digest" });
  }
}
