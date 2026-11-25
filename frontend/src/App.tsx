import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import type { CreateTranscriptionInput, Transcription } from "./types";
import { AppSidebar } from "./components/AppSidebar";
import { TranscriptionDialog } from "./components/TranscriptionDialog";
import { Dashboard } from "./pages/Dashboard";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import {
  useCreateTranscription,
  useDeleteTranscription,
  useTranscriptions,
  useUpdateTranscription,
} from "./hooks/useTranscriptions";
import "./App.css";

export default function App() {
  const { data: transcriptions = [], isLoading, isError, error, refetch } = useTranscriptions();
  const createMutation = useCreateTranscription();
  const updateMutation = useUpdateTranscription();
  const deleteMutation = useDeleteTranscription();
  const [dialog, setDialog] = useState<{
    mode: "view" | "edit" | "delete";
    transcription: Transcription;
  } | null>(null);

  const saveTranscription = async (
    transcription: CreateTranscriptionInput | Transcription,
  ) => {
    if ("id" in transcription) {
      await updateMutation.mutateAsync({
        id: transcription.id,
        payload: {
          title: transcription.title,
          content: transcription.content,
          language: transcription.language,
        },
      });
    } else {
      await createMutation.mutateAsync(transcription);
    }
    setDialog(null);
  };

  const deleteTranscription = async (id: number) => {
    await deleteMutation.mutateAsync(id);
    setDialog(null);
  };

  const loadError =
    error instanceof Error ? error.message : "Unable to load transcriptions.";

  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppSidebar />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  transcriptions={transcriptions}
                  onSave={saveTranscription}
                  isLoading={isLoading}
                  loadError={isError ? loadError : null}
                  onRetry={() => void refetch()}
                  onOpen={(transcription, mode = "view") =>
                    setDialog({ transcription, mode })
                  }
                />
              }
            />
            <Route
              path="/history"
              element={
                <HistoryPage
                  transcriptions={transcriptions}
                  isLoading={isLoading}
                  loadError={isError ? loadError : null}
                  onRetry={() => void refetch()}
                  onOpen={(transcription, mode = "view") =>
                    setDialog({ transcription, mode })
                  }
                />
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="*"
              element={
                <Dashboard
                  transcriptions={transcriptions}
                  onSave={saveTranscription}
                  isLoading={isLoading}
                  loadError={isError ? loadError : null}
                  onRetry={() => void refetch()}
                  onOpen={(transcription, mode = "view") =>
                    setDialog({ transcription, mode })
                  }
                />
              }
            />
          </Routes>
        </main>
        {dialog && (
          <TranscriptionDialog
            mode={dialog.mode}
            transcription={dialog.transcription}
            onClose={() => setDialog(null)}
            onSave={saveTranscription}
            onDelete={deleteTranscription}
          />
        )}
      </div>
    </BrowserRouter>
  );
}
