import { GoogleGenAI, Modality } from "@google/genai";
import { envData } from "../config/env.js";
const ai = new GoogleGenAI({
    apiKey: envData?.GEMINI_API_KEY,
    httpOptions: {
        apiVersion: "v1alpha",
    },
});
export async function createGeminiToken() {
    const now = Date.now();
    const token = await ai.authTokens.create({
        config: {
            uses: 1,
            expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
            newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
            liveConnectConstraints: {
                model: "gemini-3.5-transcribe-live",
                config: {
                    responseModalities: [Modality.TEXT],
                    inputAudioTranscription: {},
                },
            },
            httpOptions: {
                apiVersion: "v1alpha",
            },
        },
    });
    return token.name;
}
export async function startLiveSession() {
    const session = await ai.live.connect({
        model: "gemini-3.5-transcribe-live",
        config: {
            responseModalities: [Modality.TEXT],
            inputAudioTranscription: {},
        },
        callbacks: {
            onopen: () => {
                console.log("Gemini connected");
            },
            onmessage: (message) => {
                const transcription = message.serverContent?.inputTranscription;
                if (transcription?.text) {
                    console.log("Transcript:", transcription.text);
                }
            },
            onerror: (error) => {
                console.error("Gemini error:", error);
            },
            onclose: (event) => {
                console.log("Session closed:", event.reason);
            },
        },
    });
    return session;
}
//# sourceMappingURL=gemini.service.js.map