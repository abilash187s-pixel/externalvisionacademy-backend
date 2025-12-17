
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Registration from "../models/Registration.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.sendStatus(401);

  const ok = await bcrypt.compare(req.body.password, admin.password);
  if (!ok) return res.sendStatus(401);

  res.json(jwt.sign({ id: admin._id }, process.env.JWT_SECRET));
});

router.get("/submissions", auth, async (req, res) => {
  const items = await Registration.find().sort({ receivedAt: -1 });
  res.json({ items, total: items.length });
});

export default router;
