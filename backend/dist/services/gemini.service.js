import { GoogleGenAI, Modality } from "@google/genai";
import { envData } from "../config/env.js";
const ai = new GoogleGenAI({
    apiKey: envData?.GEMINI_API_KEY,
});
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