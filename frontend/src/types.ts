export type TranscriptionLanguage = "Hindi" | "English" | "Hinglish";
export type RecordingLanguage = "Auto Detect" | "Hindi" | "English";

export type Transcription = {
  id: number;
  title: string;
  content: string;
  language: string | null;
  duration: number | null;
  createdAt: string;
};

export type CreateTranscriptionInput = {
  title: string;
  content: string;
  language: TranscriptionLanguage;
  duration: number;
};

export type DialogMode = "view" | "edit" | "delete";
