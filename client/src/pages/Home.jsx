import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { BRANCHES } from "../utils/branches";
import Button from "../components/common/Button";

const Home = () => {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/feed" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="9" cy="10" r="2.6" fill="var(--signal)" />
            <circle cx="23" cy="9" r="2.6" fill="var(--wire)" />
            <circle cx="16" cy="22" r="2.6" fill="var(--signal)" />
            <path d="M9 10L23 9M9 10L16 22M23 9L16 22" stroke="var(--line)" strokeWidth="1.4" />
          </svg>
          <span className="font-display font-bold text-lg">CinMesh</span>
        </div>
        <div className="flex gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
          <Link to="/register"><Button size="sm">Join free</Button></Link>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono-tag text-xs text-[var(--signal)] mb-4 tracking-wide">[ B.TECH · LIVE NETWORK ]</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
              Every branch,<br />one live mesh.
            </h1>
            <p className="text-[var(--text-muted)] mt-5 text-base leading-relaxed max-w-md">
              CinMesh connects engineering students by branch and interest — post projects, ask
              doubts, and chat in real time with people actually solving the same problems as you.
            </p>
            <div className="flex gap-3 mt-8">
              <Link to="/register"><Button size="lg">Create your account</Button></Link>
              <Link to="/login"><Button variant="secondary" size="lg">I already have one</Button></Link>
            </div>
          </div>

          <div className="card p-6 relative">
            <p className="font-mono-tag text-[11px] text-[var(--text-faint)] uppercase tracking-wider mb-4">
              Live branch nodes
            </p>
            <div className="grid grid-cols-2 gap-3">
              {BRANCHES.map((b) => (
                <div key={b.code} className="rounded-xl p-3 border" style={{ borderColor: "var(--line)" }}>
                  <div className="flex items-center gap-2">
                    <span className="node-dot" style={{ background: `var(--branch-${b.code.toLowerCase()})` }} />
                    <span className="font-mono-tag text-xs">[{b.code}]</span>
                  </div>
                  <p className="text-sm mt-1.5">{b.label}</p>
                </div>
              ))}
            </div>
            <div className="trace-divider my-5" />
            <p className="text-xs text-[var(--text-faint)]">
              DSA · Web Dev · AI/ML · GATE · Placements · Internships — communities inside every branch.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
