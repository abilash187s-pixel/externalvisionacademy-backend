import express from "express";
import Registration from "../models/Registration.js";
import { sendMail } from "../utils/mailer.js";
import { sendRegistrationEmail } from "../utils/mailer.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    console.log("📝 Registration request received");
    
    // 1️⃣ Save data to MongoDB
    const data = await Registration.create(req.body);
    console.log('data',data)
    console.log("💾 Data saved:", { 
      name: data.name, 
      email: data.email,
      id: data._id 
    });
    
    // 2️⃣ Send emails using the new helper function
    // Don't await - send response immediately
    sendRegistrationEmail(data)
      .then(results => {
        console.log("📧 Email sending completed:");
        console.log("- User email:", results.userEmail.success ? "✅ Sent" : "❌ Failed");
        console.log("- Admin email:", results.adminEmail.success ? "✅ Sent" : "❌ Failed");
      })
      .catch(error => {
        console.error("📧 Email sending error:", error);
      });
    
    // 3️⃣ Respond immediately (non-blocking)
    res.json({ 
      success: true, 
      message: "Registration successful! You will receive a confirmation email shortly.",
      data: {
        id: data._id,
        name: data.name,
        email: data.email,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (err) {
    console.error("❌ Registration error:", err);
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: "This email is already registered. Please use a different email or contact support." 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Registration failed. Please try again.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;
