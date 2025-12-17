import express from "express";
import Registration from "../models/Registration.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    // 1️⃣ Save data
    const data = await Registration.create(req.body);
    console.log("data",data)
    // 2️⃣ Send user email (NON-BLOCKING)
    sendMail(
      data.email,
      "Registration Successful - External Vision Academy",
      `<h2>Thank you ${data.name}</h2>
       <p>We received your registration successfully.</p>`
    );

    // 3️⃣ Send admin email (NON-BLOCKING)
    sendMail(
      process.env.ADMIN_EMAIL || "externalvisionacademy@gmail.com",
      "New Registration Received",
      `<pre>${JSON.stringify(data, null, 2)}</pre>`
    );

    // 4️⃣ Respond immediately
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
