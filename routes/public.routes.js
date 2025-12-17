
import express from "express";
import Registration from "../models/Registration.js";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const data = await Registration.create(req.body);

     sendMail(
      data.email,
      "Registration Successful - External Vision Academy",
      `<h2>Thank you ${data.name}</h2><p>We received your registration.</p>`
    );
    
     sendMail(
      process.env.EMAIL_USER,
      "New Registration Received",
      `<pre>${JSON.stringify(data, null, 2)}</pre>`
    );

    res.json({ success: true });
  } catch (e) {
    console.log("e",e)
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
