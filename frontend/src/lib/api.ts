const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface Transcription {
  id: number;
  title: string;
  content: string;
  language: string | null;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}

export const transcriptionApi = {
  getAll: async () => {
    const result = await request<ApiResponse<Transcription[]>>(
      "/api/transcriptions",
    );
    return result.data;
  },

  getById: async (id: number) => {
    const result = await request<ApiResponse<Transcription>>(
      `/api/transcriptions/${id}`,
    );
    return result.data;
  },

  create: async (payload: {
    title: string;
    content: string;
    language: string;
    duration: number;
  }) => {
    const result = await request<ApiResponse<Transcription>>(
      "/api/transcriptions",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    return result.data;
  },

  update: async (id: number, payload: Partial<Transcription>) => {
    const result = await request<ApiResponse<Transcription>>(
      `/api/transcriptions/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
    return result.data;
  },

  delete: async (id: number) => {
    return request<{ success: boolean; message: string }>(
      `/api/transcriptions/${id}`,
      { method: "DELETE" },
    );
  },

  getGeminiToken: async () => {
    return request<
      ApiResponse<{
        token: string;
        expiresAt: string;
        model: string;
      }>
    >("/api/gemini/token", {
      method: "POST",
    });
  },
};
