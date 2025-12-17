
import nodemailer from "nodemailer";
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS EXISTS:", !!process.env.EMAIL_PASS);
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export function sendMail(to, subject, html) {
  return transporter.sendMail({
    from: `"External Vision Academy" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}
