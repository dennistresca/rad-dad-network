// Adds an email to the Resend audience used for the Daily Picks digest.
// Single opt-in (no confirmation email) — keep it simple for now, but
// every digest email carries Resend's automatic unsubscribe link/header.
import { Resend } from "resend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.error("Subscribe error: missing RESEND_API_KEY or RESEND_AUDIENCE_ID");
    return res.status(500).json({ error: "Subscriptions aren't set up yet. Please try again later." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID,
      unsubscribed: false,
    });
    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
