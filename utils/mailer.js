import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing");
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendMail(to, subject, html) {
  if (!resend) {
    console.warn("⚠ Email skipped: Resend not configured");
    return;
  }

  await resend.emails.send({
    from: process.env.FROM_EMAIL || "onboarding@resend.dev",
    to,
    subject,
    html,
  });
}
