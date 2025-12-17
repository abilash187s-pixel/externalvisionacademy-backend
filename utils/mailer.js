import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Brevo login
    pass: process.env.EMAIL_PASS, // Brevo SMTP key
  },
});

export function sendMail(to, subject, html) {
  return transporter.sendMail({
    from: "External Vision Academy <no-reply@externalvisionacademy.com>",
    to,
    subject,
    html,
  });
}
