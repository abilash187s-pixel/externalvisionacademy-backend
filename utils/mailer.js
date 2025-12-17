import { Resend } from "resend";

let resend = null;

export function initMailer() {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
}

export async function sendMail(to, subject, html) {
  if (!resend) {
    console.log("Resend not initialized");
    return;
  }

  try {
    // Use your verified domain or email
    const from = process.env.FROM_EMAIL || "onboarding@resend.dev";
    
    // If sending to externalvisionacademy@gmail.com, ensure it's verified
    const result = await resend.emails.send({
      from: from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    console.log("✅ Email sent:", result.id);
    return result;
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    
    // Log specific error for debugging
    if (err.message.includes("not authorized")) {
      console.log("⚠️ Email address not verified in Resend:", to);
    }
  }
}