import { Resend } from "resend";

let resend = null;

export function initMailer() {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
}

export async function sendMail(to, subject, html) {
  console.log('toemails',to)
  if (!resend) {
    // silently skip (no scary log)
    return;
  }

  try {
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", result.id);
  } catch (err) {
    console.error("❌ Email send failed:", err);
  }
}
