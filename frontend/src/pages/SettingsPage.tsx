import { useState } from "react";
import { Check, ChevronDown, Globe2, Mic2, SlidersHorizontal, Volume2 } from "lucide-react";
import type { RecordingLanguage } from "../types";

export function SettingsPage() {
  const [language, setLanguage] = useState<RecordingLanguage>("Auto Detect");
  const [autoSave, setAutoSave] = useState(true);
  const [sound, setSound] = useState(false);
  const [saved, setSaved] = useState(false);

  const updatePreference = (update: () => void) => {
    update();
    setSaved(false);
  };

  return (
    <div className="page-wrap">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>Settings</strong></div><div className="topbar-right"><span className="avatar topbar-avatar">V</span></div></header>
      <section className="page-heading">
        <div><div className="heading-kicker"><span className="kicker-line" /> MAKE IT YOURS</div><h1>Settings<span className="heading-period">.</span></h1><p>Fine-tune your Vaani experience.</p></div>
      </section>
      <section className="settings-card">
        <div className="settings-card-heading"><span className="settings-heading-icon"><SlidersHorizontal size={17} /></span><div><h2>Transcription preferences</h2><p>Choose how Vaani listens and works for you.</p></div></div>
        <div className="setting-row">
          <span className="setting-icon"><Globe2 size={18} /></span>
          <div className="setting-copy"><strong>Preferred language</strong><p>Choose a default language for new transcriptions.</p></div>
          <label className="settings-select-wrap"><span className="sr-only">Preferred language</span><select value={language} onChange={(event) => updatePreference(() => setLanguage(event.target.value as RecordingLanguage))}><option>Auto Detect</option><option>Hindi</option><option>English</option></select><ChevronDown size={15} /></label>
        </div>
        <div className="setting-row">
          <span className="setting-icon"><Mic2 size={18} /></span>
          <div className="setting-copy"><strong>Save transcriptions automatically</strong><p>Keep your saved work in transcription history.</p></div>
          <button className={`toggle${autoSave ? " on" : ""}`} type="button" role="switch" aria-checked={autoSave} aria-label="Save transcriptions automatically" onClick={() => updatePreference(() => setAutoSave(!autoSave))}><span /></button>
        </div>
        <div className="setting-row">
          <span className="setting-icon"><Volume2 size={18} /></span>
          <div className="setting-copy"><strong>Recording sounds</strong><p>Play a subtle sound when recording starts or stops.</p></div>
          <button className={`toggle${sound ? " on" : ""}`} type="button" role="switch" aria-checked={sound} aria-label="Recording sounds" onClick={() => updatePreference(() => setSound(!sound))}><span /></button>
        </div>
        <div className="settings-footer"><span>{saved && <><Check size={15} /> Preferences saved</>}</span><button type="button" className="button button-primary" onClick={() => setSaved(true)}>Save preferences</button></div>
      </section>
      <div className="settings-note"><span className="settings-note-icon">i</span><p><strong>Preview settings</strong> Preferences are stored in this session preview and aren’t synced to an account.</p></div>
    </div>
  );
}
