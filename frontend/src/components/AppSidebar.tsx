import { AudioLines, Clock3, Mic2, Settings2 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export function AppSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <button
        className="brand"
        type="button"
        onClick={() => navigate("/")}
        aria-label="Vaani home"
      >
        <span className="brand-mark">
          <AudioLines size={20} strokeWidth={2.2} />
        </span>
        <span>
          vaani<span className="brand-period">.</span>
        </span>
      </button>

      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          <Mic2 size={18} />
          <span>New transcription</span>
          <span className="nav-shortcut">⌘ N</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          <Clock3 size={18} />
          <span>Transcription history</span>
        </NavLink>
      </nav>

      {/* <div className="sidebar-bottom">
        <div className="sidebar-promo">
          <span className="promo-icon">
            <AudioLines size={16} />
          </span>
          <strong>Words, your way.</strong>
          <p>Multilingual speech recognition, made simple.</p>
          <div className="promo-languages">
            <span>हिंदी</span>
            <i /> <span>English</span>
            <i /> <span>Hinglish</span>
          </div>
        </div>
        <div className="sidebar-footer">
          <span className="avatar">V</span>
          <span className="footer-copy">
            <strong>Vaani workspace</strong>
            <small>Personal plan</small>
          </span>
          <span className="online-dot" aria-label="Online" />
        </div>
      </div> */}
    </aside>
  );
}
