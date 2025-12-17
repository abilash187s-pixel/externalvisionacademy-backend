import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import Admin from "./models/Admin.js";

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@externalvisionacademy.com";
  const plainPassword = "admin123"; // YOU CAN CHANGE THIS

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("❗ Admin already exists");
    process.exit(0);
  }

  await Admin.create({
    email,
    password: hashedPassword
  });

  console.log("✅ Admin created successfully");
  console.log("📧 Email:", email);
  console.log("🔑 Password:", plainPassword);

  process.exit(0);
}

createAdmin();
