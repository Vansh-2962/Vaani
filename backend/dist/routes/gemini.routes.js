import { Router } from "express";
import { createToken } from "../controllers/gemini.controller.js";
const router = Router();
router.post("/token", createToken);
export default router;
//# sourceMappingURL=gemini.routes.js.map