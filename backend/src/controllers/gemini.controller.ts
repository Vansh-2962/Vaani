import { createGeminiToken } from "../services/gemini.service.js";
import type { Request, Response } from "express";

export const createToken = async (_req: Request, res: Response) => {
  try {
    const token = await createGeminiToken();

    res.json({ token });
  } catch (error) {
    console.error("Gemini token error:", error);

    res.status(500).json({
      message: "Unable to generate Gemini token",
    });
  }
};
