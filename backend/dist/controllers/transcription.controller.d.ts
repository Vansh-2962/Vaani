import type { Request, Response } from "express";
import { transcriptions } from "../db/schema.js";
type TranscriptionIdParams = {
    id: string;
};
type TranscriptionInsert = typeof transcriptions.$inferInsert;
type CreateTranscriptionBody = Pick<TranscriptionInsert, "title" | "content"> & Partial<Pick<TranscriptionInsert, "language" | "duration">>;
type UpdateTranscriptionBody = Partial<Pick<TranscriptionInsert, "title" | "content" | "language">>;
export declare const createTranscription: (req: Request<{}, unknown, CreateTranscriptionBody>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTranscriptions: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTranscriptionById: (req: Request<TranscriptionIdParams>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTranscription: (req: Request<TranscriptionIdParams, unknown, UpdateTranscriptionBody>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTranscription: (req: Request<TranscriptionIdParams>, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=transcription.controller.d.ts.map