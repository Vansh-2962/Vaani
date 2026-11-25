import { useMemo, useState } from "react";
import { AudioLines, Search, SlidersHorizontal } from "lucide-react";
import type { DialogMode, Transcription } from "../types";
import { TranscriptionItem } from "../components/TranscriptionItem";

type Props = {
  transcriptions: Transcription[];
  isLoading: boolean;
  loadError: string | null;
  onRetry: () => void;
  onOpen: (transcription: Transcription, mode?: DialogMode) => void;
};

export function HistoryPage({
  transcriptions,
  isLoading,
  loadError,
  onRetry,
  onOpen,
}: Props) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All languages");
  const [sort, setSort] = useState("Newest first");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return transcriptions
      .filter((item) => {
        const matchesQuery =
          !normalizedQuery ||
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.content.toLowerCase().includes(normalizedQuery);
        const matchesLanguage = language === "All languages" || item.language === language;
        return matchesQuery && matchesLanguage;
      })
      .sort((a, b) =>
        sort === "Newest first"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [transcriptions, query, language, sort]);

  return (
    <div className="page-wrap">
      <header className="topbar">
        <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>History</strong></div>
        <div className="topbar-right"><span className="topbar-note"><span className="status-dot" /> All changes saved</span><span className="avatar topbar-avatar">V</span></div>
      </header>
      <section className="page-heading history-heading">
        <div>
          <div className="heading-kicker"><span className="kicker-line" /> YOUR WORDS, ALL IN ONE PLACE</div>
          <h1>Transcription history<span className="heading-period">.</span></h1>
          <p>Revisit, refine, and find the things you’ve said.</p>
        </div>
        <div className="history-total"><strong>{transcriptions.length.toString().padStart(2, "0")}</strong><span>TRANSCRIPTIONS</span></div>
      </section>

      <section className="history-card">
        <div className="history-toolbar">
          <div className="search-field">
            <Search size={17} />
            <input aria-label="Search transcriptions" placeholder="Search by title or content..." value={query} onChange={(event) => setQuery(event.target.value)} />
            {query && <button type="button" className="clear-search" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
          </div>
          <div className="filter-controls">
            <div className="filter-select">
              <SlidersHorizontal size={15} />
              <select aria-label="Filter by language" value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option>All languages</option><option>Hindi</option><option>English</option><option>Hinglish</option>
              </select>
            </div>
            <select className="sort-select" aria-label="Sort by date" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option>Newest first</option><option>Oldest first</option>
            </select>
          </div>
        </div>
        <div className="history-list-heading"><span>TRANSCRIPTION</span><span>LANGUAGE &amp; DATE</span><span>ACTIONS</span></div>
        {loadError ? (
          <div className="empty-state history-empty">
            <span className="empty-icon"><AudioLines size={24} /></span>
            <strong>Couldn’t load your transcriptions</strong>
            <p>{loadError}</p>
            <button className="button button-secondary" type="button" onClick={onRetry}>Try again</button>
          </div>
        ) : isLoading ? (
          <div className="empty-state history-empty" role="status">
            <span className="empty-icon"><AudioLines size={24} /></span>
            <strong>Loading your transcriptions…</strong>
            <p>Your saved recordings will appear here shortly.</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="history-list">
            {filtered.map((transcription) => <TranscriptionItem key={transcription.id} transcription={transcription} variant="row" onOpen={onOpen} />)}
          </div>
        ) : (
          <div className="empty-state history-empty">
            <span className="empty-icon"><AudioLines size={24} /></span>
            <strong>{transcriptions.length === 0 ? "Your story starts here" : "No transcriptions found"}</strong>
            <p>{transcriptions.length === 0 ? "Once you save a transcription, it’ll be waiting for you here." : "Try another search or adjust your filters."}</p>
            {(query || language !== "All languages") && <button className="button button-secondary" type="button" onClick={() => { setQuery(""); setLanguage("All languages"); }}>Clear filters</button>}
          </div>
        )}
        {!isLoading && !loadError && filtered.length > 0 && <div className="history-result-count">Showing <strong>{filtered.length}</strong> of {transcriptions.length} transcriptions</div>}
      </section>
      <p className="mock-note"><span><AudioLines size={13} /></span> Your saved recordings stay in sync across your workspace.</p>
    </div>
  );
}
