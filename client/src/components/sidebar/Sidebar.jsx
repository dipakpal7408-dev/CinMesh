import { Link, useLocation } from "react-router-dom";
import { BRANCHES } from "../../utils/branches";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-20 space-y-6">
        <div className="card p-4">
          <p className="font-mono-tag text-[11px] text-[var(--text-faint)] uppercase tracking-wider mb-3">
            Branches
          </p>
          <ul className="space-y-1">
            {BRANCHES.map((b) => {
              const active = location.pathname === `/communities/${b.code.toLowerCase()}`;
              return (
                <li key={b.code}>
                  <Link
                    to={`/communities?branch=${b.code}`}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-[var(--panel-raised)] text-[var(--text-primary)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span className="node-dot" style={{ background: `var(--branch-${b.code.toLowerCase()})` }} />
                    <span className="font-mono-tag text-xs">[{b.code}]</span>
                    <span className="truncate">{b.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card p-4">
          <p className="font-mono-tag text-[11px] text-[var(--text-faint)] uppercase tracking-wider mb-3">
            Quick links
          </p>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/communities?category=Placements" className="block px-2.5 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Placements Prep
              </Link>
            </li>
            <li>
              <Link to="/communities?category=Internships" className="block px-2.5 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Internship Finder
              </Link>
            </li>
            <li>
              <Link to="/communities?category=GATE" className="block px-2.5 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                GATE Aspirants
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
