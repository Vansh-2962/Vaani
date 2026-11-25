export function formatDuration(seconds: number | null) {
  const duration = seconds ?? 0;
  const minutes = Math.floor(duration / 60);
  const remainingSeconds = duration % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getPreview(content: string, length = 120) {
  return content.length > length ? `${content.slice(0, length).trimEnd()}…` : content;
}
