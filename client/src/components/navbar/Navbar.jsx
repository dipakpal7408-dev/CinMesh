import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../common/Avatar";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ borderColor: "var(--line)", background: "rgba(20,23,29,0.85)" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="9" cy="10" r="2.6" fill="var(--signal)" />
            <circle cx="23" cy="9" r="2.6" fill="var(--wire)" />
            <circle cx="16" cy="22" r="2.6" fill="var(--signal)" />
            <path d="M9 10L23 9M9 10L16 22M23 9L16 22" stroke="var(--line)" strokeWidth="1.4" />
          </svg>
          <span className="font-display font-bold text-lg tracking-tight">CinMesh</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden sm:block">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, branches, skills…"
            className="w-full px-3 py-2 rounded-lg text-sm bg-[var(--panel)] border border-[var(--line)] placeholder:text-[var(--text-faint)] focus:border-[var(--signal)] outline-none"
          />
        </form>

        <nav className="flex items-center gap-1 ml-auto text-sm font-medium">
          <Link
            to="/feed"
            className="px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hidden md:inline"
          >
            Feed
          </Link>
          <Link
            to="/communities"
            className="px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hidden md:inline"
          >
            Communities
          </Link>
          <Link
            to="/chat"
            className="px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Chat
          </Link>
          <Link
            to="/notifications"
            className="px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Alerts
          </Link>

          <div className="relative ml-2">
            <button onClick={() => setMenuOpen((o) => !o)} aria-label="Account menu">
              <Avatar user={user} size="sm" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-44 card p-1.5 shadow-xl"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link
                  to={`/profile/${user?._id}`}
                  className="block px-3 py-2 rounded-md text-sm hover:bg-[var(--panel-raised)]"
                  onClick={() => setMenuOpen(false)}
                >
                  Your profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-sm hover:bg-[var(--panel-raised)]"
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-[var(--danger)] hover:bg-[var(--panel-raised)]"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
