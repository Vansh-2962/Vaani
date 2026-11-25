import { createGeminiToken } from "../services/gemini.service.js";
export const createToken = async (_req, res) => {
    try {
        const token = await createGeminiToken();
        res.json({ token });
    }
    catch (error) {
        console.error("Gemini token error:", error);
        res.status(500).json({
            message: "Unable to generate Gemini token",
        });
    }
};
//# sourceMappingURL=gemini.controller.js.map