import express from "express";
import { chatWithAI } from "../controllers/chat.controller";

const router = express.Router();

router.post("/", chatWithAI);

export default router;
