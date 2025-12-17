import express from "express";
import Registration from "../models/Registration.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    // 1️⃣ Save data
    const data = await Registration.create(req.body);
    console.log("Registration data:", data);

    // 2️⃣ Send user email using Nodemailer
    sendMail(
      data.email,
      "Registration Successful - External Vision Academy",
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Registration Successful!</h2>
        <p>Dear ${data.name},</p>
        <p>Thank you for registering with External Vision Academy. We have received your registration successfully.</p>
        <p>Our team will contact you shortly with further details.</p>
        <br>
        <p><strong>Registration Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${data.name}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone}</li>
          <li><strong>Course:</strong> ${data.course}</li>
          <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>
        <br>
        <p>Best regards,</p>
        <p><strong>External Vision Academy Team</strong></p>
      </div>`
    );

    // 3️⃣ Send admin email (using Resend if configured)
    sendMail(
      "externalvisionacademy@gmail.com",
      "New Registration Received",
      `<div style="font-family: monospace; background: #f4f4f4; padding: 20px;">
        <h3>New Registration Alert!</h3>
        <p>A new student has registered for the course.</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      </div>`,
      { useResend: true } // Try to use Resend for admin
    );

    // 4️⃣ Respond immediately
    res.json({ 
      success: true, 
      message: "Registration successful! Check your email for confirmation." 
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    
    // Check if it's a duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "This email is already registered" 
      });
    }
    
    res.status(500).json({ 
      error: "Registration failed. Please try again." 
    });
  }
});

export default router;
