import { useEffect, useState } from "react";
import { AlertTriangle, Check, Copy, X } from "lucide-react";
import type { DialogMode, Transcription } from "../types";
import { formatDate, formatDuration } from "../utils";

type Props = {
  mode: DialogMode;
  transcription: Transcription;
  onClose: () => void;
  onSave: (transcription: Transcription) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export function TranscriptionDialog({
  mode,
  transcription,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [title, setTitle] = useState(transcription.title);
  const [content, setContent] = useState(transcription.content);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [mutationError, setMutationError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    window.setTimeout(() => setCopyState("idle"), 2200);
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMutationError("");
    setIsSaving(true);
    try {
      await onSave({ ...transcription, title: title.trim(), content: content.trim() });
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async () => {
    setMutationError("");
    setIsSaving(true);
    try {
      await onDelete(transcription.id);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to delete transcription.");
    } finally {
      setIsSaving(false);
    }
  };

  if (mode === "delete") {
    return (
      <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <section className="dialog delete-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <button className="dialog-close" type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
          <span className="delete-icon"><AlertTriangle size={21} /></span>
          <h2 id="dialog-title">Delete transcription?</h2>
          <p>“{transcription.title}” will be permanently removed. This action can’t be undone.</p>
          {mutationError && <p className="inline-feedback error-feedback">{mutationError}</p>}
          <div className="dialog-actions">
            <button type="button" className="button button-secondary" onClick={onClose} disabled={isSaving}>Cancel</button>
            <button type="button" className="button button-danger" onClick={remove} disabled={isSaving}>{isSaving ? "Deleting…" : "Delete transcription"}</button>
          </div>
        </section>
      </div>
    );
  }

  const isEditing = mode === "edit";
  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog transcription-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <header className="dialog-header">
          <div>
            <span className="eyebrow">{isEditing ? "EDIT TRANSCRIPTION" : "TRANSCRIPTION"}</span>
            <h2 id="dialog-title">{isEditing ? "Make it yours" : transcription.title}</h2>
          </div>
          <button className="dialog-close" type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        <form onSubmit={save}>
          <div className="dialog-meta">
            <span className={`language-tag ${transcription.language?.toLowerCase() ?? "unknown"}`}>{transcription.language ?? "Auto"}</span>
            <span>{formatDate(transcription.createdAt)}</span>
            <span>{formatDuration(transcription.duration)}</span>
          </div>
          <label className="field-label" htmlFor="transcription-title">Title</label>
          <input
            id="transcription-title"
            className="text-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            readOnly={!isEditing}
            required
            maxLength={100}
          />
          <label className="field-label" htmlFor="transcription-content">Transcription</label>
          <textarea
            id="transcription-content"
            className="transcript-textarea dialog-textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            readOnly={!isEditing}
            required
            rows={7}
          />
          <footer className="dialog-footer">
            <button className="button button-secondary" type="button" onClick={copyText}>
              {copyState === "copied" ? <Check size={16} /> : <Copy size={16} />}
              {copyState === "copied" ? "Copied" : "Copy text"}
            </button>
            <div className="dialog-actions">
              <button className="button button-secondary" type="button" onClick={onClose}>Close</button>
              {isEditing && <button className="button button-primary" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save changes"}</button>}
            </div>
          </footer>
          {mutationError && <p className="inline-feedback error-feedback">{mutationError}</p>}
          {copyState === "error" && <p className="inline-feedback error-feedback">Clipboard access was denied by your browser.</p>}
        </form>
      </section>
    </div>
  );
}
