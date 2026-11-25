import { eq, desc } from "drizzle-orm";
import { db } from "../config/db.js";
import { transcriptions } from "../db/schema.js";
export const createTranscription = async (req, res) => {
    try {
        const { title, content, language, duration } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }
        const [transcription] = await db
            .insert(transcriptions)
            .values({
            title,
            content,
            language: language || "auto",
            duration: duration || 0,
        })
            .returning();
        return res.status(201).json({
            success: true,
            data: transcription,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to save transcription",
        });
    }
};
export const getTranscriptions = async (_req, res) => {
    try {
        const data = await db
            .select()
            .from(transcriptions)
            .orderBy(desc(transcriptions.createdAt));
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transcriptions",
        });
    }
};
export const getTranscriptionById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid transcription ID",
            });
        }
        const [data] = await db
            .select()
            .from(transcriptions)
            .where(eq(transcriptions.id, id));
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Transcription not found",
            });
        }
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transcription",
        });
    }
};
export const updateTranscription = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, content, language } = req.body;
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid transcription ID",
            });
        }
        const [data] = await db
            .update(transcriptions)
            .set({
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content }),
            ...(language !== undefined && { language }),
            updatedAt: new Date(),
        })
            .where(eq(transcriptions.id, id))
            .returning();
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Transcription not found",
            });
        }
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update transcription",
        });
    }
};
export const deleteTranscription = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid transcription ID",
            });
        }
        const [data] = await db
            .delete(transcriptions)
            .where(eq(transcriptions.id, id))
            .returning();
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Transcription not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Transcription deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete transcription",
        });
    }
};
//# sourceMappingURL=transcription.controller.js.map