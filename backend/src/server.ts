import "dotenv/config";
import express from "express";
import cors from "cors";

import transcriptionRoutes from "./routes/transcription.routes.js";
import geminiRoutes from "./routes/gemini.routes.js";
import { envData } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://vaani-wheat.vercel.app"],
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Procucev Speech API is running",
  });
});

app.use("/api/transcriptions", transcriptionRoutes);
app.use("/api/gemini", geminiRoutes);

const PORT = envData?.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
