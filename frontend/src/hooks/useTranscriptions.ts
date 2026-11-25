import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { GoogleGenAI, Modality, type Session } from "@google/genai";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { transcriptionApi } from "../lib/api";

export function useTranscriptions() {
  return useQuery({
    queryKey: ["transcriptions"],
    queryFn: transcriptionApi.getAll,
  });
}

export function useTranscription(id: number) {
  return useQuery({
    queryKey: ["transcriptions", id],
    queryFn: () => transcriptionApi.getById(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useCreateTranscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transcriptionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transcriptions"],
      });
    },
  });
}

export function useUpdateTranscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof transcriptionApi.update>[1];
    }) => transcriptionApi.update(id, payload),

    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ["transcriptions"],
      });

      queryClient.setQueryData(["transcriptions", updated.id], updated);
    },
  });
}

export function useDeleteTranscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transcriptionApi.delete,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["transcriptions"],
      });

      queryClient.removeQueries({
        queryKey: ["transcriptions", id],
      });
    },
  });
}

export function useGeminiToken() {
  return useMutation({
    mutationFn: transcriptionApi.getGeminiToken,
  });
}

interface LiveTranscriptionOptions {
  onTranscript: (text: string) => void;
}

export function useLiveTranscription({
  onTranscript,
}: LiveTranscriptionOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<Session | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const stopRecording = useCallback(async () => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();

    processorRef.current = null;
    sourceRef.current = null;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }

    sessionRef.current?.close();
    sessionRef.current = null;

    setIsRecording(false);
    setIsConnecting(false);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setIsConnecting(true);

      //  Get  token
      const response = await fetch(`${API_URL}/api/gemini/token`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate Gemini token");
      }

      const result = await response.json();

      const token = result.token;

      //  Connect
      const ai = new GoogleGenAI({
        apiKey: token,
        httpOptions: {
          apiVersion: "v1alpha",
        },
      });

      const session = await ai.live.connect({
        model: "gemini-3.5-transcribe-live",
        config: {
          responseModalities: [Modality.TEXT],
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsRecording(true);
          },

          onmessage: (message) => {
            const text = message.serverContent?.inputTranscription?.text;

            if (text) {
              onTranscript(text);
            }
          },

          onerror: (event) => {
            console.error("Gemini Live error:", event);
            setError("Speech recognition failed.");
          },

          onclose: () => {
            setIsRecording(false);
          },
        },
      });

      sessionRef.current = session;

      // Microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;

      // Capture  audio
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      await audioContext.resume();

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);

        const pcm16 = convertToPCM16(input, audioContext.sampleRate, 16000);

        session.sendRealtimeInput({
          audio: {
            data: arrayBufferToBase64(pcm16.buffer),
            mimeType: "audio/pcm;rate=16000",
          },
        });
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Unable to start recording",
      );
      await stopRecording();
    } finally {
      setIsConnecting(false);
    }
  }, [onTranscript, stopRecording]);

  return {
    startRecording,
    stopRecording,
    isRecording,
    isConnecting,
    error,
  };
}

function convertToPCM16(
  input: Float32Array,
  inputRate: number,
  outputRate: number,
) {
  const ratio = inputRate / outputRate;
  const outputLength = Math.floor(input.length / ratio);
  const output = new Int16Array(outputLength);

  for (let i = 0; i < outputLength; i++) {
    const sample = input[Math.floor(i * ratio)];
    const clamped = Math.max(-1, Math.min(1, sample));

    output[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }

  return output;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}
