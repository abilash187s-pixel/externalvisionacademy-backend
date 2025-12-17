
import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from "./routes/public.routes.js";

// dotenv.config();
connectDB();

const app = express();

// app.use(cors({
//   origin: ["https://externalvisionacademy.com", "https://www.externalvisionacademy.com","http://localhost:5000"],
//   credentials: true
// }));
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

app.listen(process.env.PORT || 5000);
