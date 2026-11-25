import { Router } from "express";

import {
  createTranscription,
  getTranscriptions,
  getTranscriptionById,
  updateTranscription,
  deleteTranscription,
} from "../controllers/transcription.controller.js";

const router: Router = Router();

router.post("/", createTranscription);
router.get("/", getTranscriptions);
router.get("/:id", getTranscriptionById);
router.patch("/:id", updateTranscription);
router.delete("/:id", deleteTranscription);

export default router;
