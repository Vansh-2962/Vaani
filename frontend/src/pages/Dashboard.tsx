import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownToLine,
  AudioLines,
  Check,
  ChevronDown,
  Copy,
  Mic,
  Pause,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import type {
  DialogMode,
  CreateTranscriptionInput,
  RecordingLanguage,
  Transcription,
  TranscriptionLanguage,
} from "../types";
import { TranscriptionItem } from "../components/TranscriptionItem";
import { formatDuration } from "../utils";
import { useLiveTranscription } from "../hooks/useTranscriptions";

type Props = {
  transcriptions: Transcription[];
  isLoading: boolean;
  loadError: string | null;
  onRetry: () => void;
  onSave: (transcription: CreateTranscriptionInput) => Promise<void>;
  onOpen: (transcription: Transcription, mode?: DialogMode) => void;
};

const waveformBars = [
  12, 20, 15, 30, 18, 38, 25, 16, 33, 22, 42, 18, 29, 14, 35, 21, 12, 28, 17,
  38, 24, 15, 32, 19, 12, 26, 17, 35, 22, 13, 30, 18, 40, 23, 14, 32, 19, 27,
  15, 36, 20, 12, 29, 17, 34, 22, 14, 30, 18, 38, 24, 13, 33, 19, 27, 15,
];

export function Dashboard({
  transcriptions,
  isLoading,
  loadError,
  onRetry,
  onSave,
  onOpen,
}: Props) {
  const [language, setLanguage] = useState<RecordingLanguage>("Auto Detect");
  // const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState(false);

  const handleTranscript = useCallback((text: string) => {
    setTranscript((previous) => previous + text);
  }, []);

  const { startRecording, stopRecording, isRecording, isConnecting, error } =
    useLiveTranscription({
      onTranscript: handleTranscript,
    });

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(
      () => setElapsed((time) => time + 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [isRecording]);

  const clearTranscript = () => {
    setTranscript("");
    setTitle("");
    setElapsed(0);
    setSaveMessage("");
    setSaveError(false);
    setCopyState("idle");
  };

  const copyTranscript = async () => {
    if (!transcript.trim()) return;
    try {
      await navigator.clipboard.writeText(transcript);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    window.setTimeout(() => setCopyState("idle"), 2200);
  };

  const saveTranscript = async () => {
    if (!title.trim() || !transcript.trim()) return;
    const languageForTranscript: TranscriptionLanguage =
      language !== "Auto Detect"
        ? language
        : /[\u0900-\u097F]/.test(transcript)
          ? "Hindi"
          : "English";

    setSaveMessage("");
    setSaveError(false);
    try {
      await onSave({
        title: title.trim(),
        content: transcript.trim(),
        language: languageForTranscript,
        duration: elapsed,
      });
      setSaveMessage("Saved to your transcription history.");
      setTitle("");
      setTranscript("");
      setElapsed(0);
    } catch (saveError) {
      setSaveError(true);
      setSaveMessage(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this transcription.",
      );
    }
  };

  return (
    <div className="page-wrap">
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-slash">/</span>
          <strong>New transcription</strong>
        </div>
        <div className="topbar-right">
          <span className="topbar-note">
            <span className="status-dot" /> All changes saved
          </span>
          {/* <button type="button" className="help-button" aria-label="Help">
            <CircleHelp size={18} />
          </button> */}
          <span className="avatar topbar-avatar">V</span>
        </div>
      </header>

      <section className="page-heading">
        <div>
          <div className="heading-kicker">
            <span className="kicker-line" /> YOUR VOICE, UNDERSTOOD
          </div>
          <h1>
            Speech to text<span className="heading-period">.</span>
          </h1>
          <p>Turn your voice into accurate text, instantly.</p>
        </div>
        <div className="supported-languages">
          <span className="language-globe">अ</span>
          <div>
            <small>SUPPORTED LANGUAGES</small>
            <strong>
              Hindi <i>·</i> English <i>·</i> Hinglish
            </strong>
          </div>
        </div>
      </section>

      <section className="recording-card">
        <div className="recording-card-top">
          <div className="section-title-with-icon">
            <span className="small-icon-block">
              <AudioLines size={17} />
            </span>
            <div>
              <h2>New transcription</h2>
              <p>Capture your thoughts while they’re fresh.</p>
            </div>
          </div>
          <div className="live-ready">
            <span className="ready-dot" /> READY TO LISTEN
          </div>
        </div>
        <div className="recording-body">
          <div
            className={`recording-controls${isRecording ? " is-recording" : ""}`}
          >
            <label
              className="field-label language-label"
              htmlFor="recording-language"
            >
              TRANSCRIPTION LANGUAGE
            </label>
            <div className="select-wrap">
              <select
                id="recording-language"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as RecordingLanguage)
                }
                disabled={isRecording}
              >
                <option>Auto Detect</option>
                <option>Hindi</option>
                <option>English</option>
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </div>
            <div className="mic-stage">
              <div className="mic-halo halo-one" />
              <div className="mic-halo halo-two" />
              <button
                type="button"
                className={`mic-button${isRecording ? " recording" : ""}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isConnecting}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? (
                  <Pause size={23} fill="currentColor" />
                ) : (
                  <Mic size={24} />
                )}
              </button>
            </div>
            <div className={`recording-status${isRecording ? " active" : ""}`}>
              <span className="recording-indicator" />
              <span>
                {isRecording ? "Recording in progress" : "Ready when you are"}
              </span>
            </div>
            <div className="recording-timer">{formatDuration(elapsed)}</div>
            <button
              type="button"
              className={`record-button${isRecording ? " stop" : ""}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isConnecting}
            >
              {isRecording ? (
                <>
                  <span className="stop-square" /> Stop recording
                </>
              ) : (
                <>
                  <Mic size={15} /> Start recording
                </>
              )}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="recording-hint">
              Click the microphone and start speaking.
            </p>
          </div>

          <div className="transcript-panel">
            <div className="transcript-panel-head">
              <div>
                <div className="transcript-label">TRANSCRIPTION OUTPUT</div>
                <div className="transcript-subtitle">
                  {isRecording ? (
                    <>
                      <span className="live-dot" /> Live recording preview
                    </>
                  ) : (
                    "Your words will appear here"
                  )}
                </div>
              </div>
              <button
                className="subtle-icon-button"
                type="button"
                onClick={clearTranscript}
                aria-label="Clear transcription"
                title="Clear"
              >
                <RotateCcw size={15} />
              </button>
            </div>
            <label className="sr-only" htmlFor="transcript-title">
              Transcription title
            </label>
            <input
              id="transcript-title"
              className="title-input"
              placeholder="Give this transcription a title..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
            />
            <label className="sr-only" htmlFor="transcript-content">
              Transcription text
            </label>
            <textarea
              id="transcript-content"
              className="transcript-textarea"
              placeholder="Your transcription will appear here..."
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
            />
            <div className="transcript-footer">
              <span className="character-count">
                {transcript.length} characters
              </span>
              <div className="transcript-actions">
                <button
                  className="button button-secondary copy-button"
                  type="button"
                  onClick={copyTranscript}
                  disabled={!transcript.trim()}
                >
                  {copyState === "copied" ? (
                    <Check size={15} />
                  ) : (
                    <Copy size={15} />
                  )}
                  {copyState === "copied" ? "Copied" : "Copy text"}
                </button>
                <button
                  className="button button-primary save-button"
                  type="button"
                  onClick={saveTranscript}
                  disabled={!title.trim() || !transcript.trim()}
                >
                  <ArrowDownToLine size={15} /> Save transcription
                </button>
              </div>
            </div>
            {copyState === "error" && (
              <p className="inline-feedback error-feedback">
                Clipboard access was denied by your browser.
              </p>
            )}
            {saveMessage && (
              <p
                className={`inline-feedback ${saveError ? "error-feedback" : "success-feedback"}`}
              >
                {!saveError && <Check size={14} />} {saveMessage}
              </p>
            )}
          </div>
        </div>
        <div
          className={`recording-card-foot${isRecording ? " recording-foot-active" : ""}`}
        >
          <div
            className="waveform"
            aria-label={
              isRecording ? "Recording audio waveform" : "Audio waveform idle"
            }
            role="img"
          >
            {waveformBars.map((height, index) => (
              <span
                key={index}
                style={{
                  height: `${height}px`,
                  animationDelay: `${(index % 12) * 0.07}s`,
                }}
              />
            ))}
          </div>
          <div className="waveform-caption">
            <span className="waveform-status-icon">
              <Sparkles size={14} />
            </span>
            <span>
              {isRecording
                ? "Listening for your voice..."
                : "Your voice. Transcribed with care."}
            </span>
          </div>
          <span className="preview-chip">LIVE TRANSCRIPTION</span>
        </div>
      </section>

      <section className="recent-section">
        <div className="section-heading-row">
          <div>
            <div className="section-eyebrow">PICK UP WHERE YOU LEFT OFF</div>
            <h2>
              Recent transcriptions{" "}
              <span className="count-badge">
                {isLoading ? "…" : transcriptions.length}
              </span>
            </h2>
          </div>
          <Link className="text-link" to="/history">
            View all <span>↗</span>
          </Link>
        </div>
        {loadError ? (
          <div className="empty-state compact-empty">
            <strong>Couldn’t load your transcriptions</strong>
            <p>{loadError}</p>
            <button
              className="button button-secondary"
              type="button"
              onClick={onRetry}
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="empty-state compact-empty" role="status">
            <strong>Loading your transcriptions…</strong>
            <p>Your saved recordings will appear here shortly.</p>
          </div>
        ) : transcriptions.length > 0 ? (
          <div className="recent-list">
            {transcriptions.slice(0, 3).map((transcription) => (
              <TranscriptionItem
                key={transcription.id}
                transcription={transcription}
                onOpen={onOpen}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state compact-empty">
            <span className="empty-icon">
              <AudioLines size={22} />
            </span>
            <strong>No transcriptions yet</strong>
            <p>Your saved recordings will show up here.</p>
          </div>
        )}
      </section>
      <p className="mock-note">
        <span>
          <Sparkles size={13} />
        </span>{" "}
        Recordings are transcribed live and saved to your history.
      </p>
    </div>
  );
}
