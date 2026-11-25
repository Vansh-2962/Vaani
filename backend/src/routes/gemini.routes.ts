import { Router } from "express";
import { createToken } from "../controllers/gemini.controller.js";

const router: Router = Router();

router.post("/token", createToken);

export default router;
