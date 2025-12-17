
import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST LINE, NO PATH
import { initMailer } from "./utils/mailer.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from "./routes/public.routes.js";

const app = express();

/* DEBUG (remove later) */
console.log("RESEND_API_KEY:", !!process.env.RESEND_API_KEY);
console.log("MONGO_URI:", !!process.env.MONGO_URI);

connectDB();
initMailer();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://externalvisionacademy.com",
    "https://www.externalvisionacademy.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use("/api", publicRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("EVA Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
