import nodemailer from "nodemailer";
import { Resend } from "resend";

let resend = null;
let nodemailerTransporter = null;

export function initMailer() {
  // Initialize Nodemailer for user emails
  nodemailerTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Initialize Resend for admin emails (optional)
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
}

export async function sendMail(to, subject, html, options = {}) {
  const { useResend = false } = options;
  
  // If it's admin email AND Resend is configured, use Resend
  if (useResend && resend && to === "externalvisionacademy@gmail.com") {
    try {
      const result = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject,
        html,
      });
      console.log("✅ Admin email sent via Resend:", result.id);
      return result;
    } catch (err) {
      console.error("❌ Resend failed, falling back to nodemailer:", err.message);
    }
  }
  
  // Use Nodemailer for all user emails
  try {
    const mailOptions = {
      from: `"External Vision Academy" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
    };
    
    const result = await nodemailerTransporter.sendMail(mailOptions);
    console.log("✅ Email sent via Nodemailer:", result.messageId);
    return result;
  } catch (err) {
    console.error("❌ Nodemailer failed:", err.message);
    throw err;
  }
}