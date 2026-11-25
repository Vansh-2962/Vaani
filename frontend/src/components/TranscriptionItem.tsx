import { Clock3, Edit3, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type { Transcription, DialogMode } from "../types";
import { formatDate, formatDuration, getPreview } from "../utils";

type Props = {
  transcription: Transcription;
  variant?: "card" | "row";
  onOpen: (transcription: Transcription, mode?: DialogMode) => void;
};

export function TranscriptionItem({
  transcription,
  variant = "card",
  onOpen,
}: Props) {
  return (
    <article className={`transcription-item ${variant}`}>
      <div className="transcription-main">
        <div className="transcription-heading">
          <h3>{transcription.title}</h3>
          <span className={`language-tag ${transcription.language?.toLowerCase() ?? "unknown"}`}>
            {transcription.language ?? "Auto"}
          </span>
        </div>
        <p className="transcription-preview">{getPreview(transcription.content)}</p>
        <div className="transcription-meta">
          <span>{formatDate(transcription.createdAt)}</span>
          <span className="meta-separator">·</span>
          <span><Clock3 size={13} /> {formatDuration(transcription.duration)}</span>
        </div>
      </div>
      <div className="item-actions">
        <button className="icon-button" type="button" onClick={() => onOpen(transcription, "view")} aria-label="View transcription" title="View">
          <Eye size={16} />
        </button>
        <button className="icon-button" type="button" onClick={() => onOpen(transcription, "edit")} aria-label="Edit transcription" title="Edit">
          <Edit3 size={16} />
        </button>
        <button className="icon-button danger-hover" type="button" onClick={() => onOpen(transcription, "delete")} aria-label="Delete transcription" title="Delete">
          <Trash2 size={16} />
        </button>
        <button className="icon-button overflow-action" type="button" onClick={() => onOpen(transcription, "view")} aria-label="More actions">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </article>
  );
}
