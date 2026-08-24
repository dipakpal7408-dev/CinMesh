import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="9" cy="10" r="2.6" fill="var(--signal)" />
            <circle cx="23" cy="9" r="2.6" fill="var(--wire)" />
            <circle cx="16" cy="22" r="2.6" fill="var(--signal)" />
            <path d="M9 10L23 9M9 10L16 22M23 9L16 22" stroke="var(--line)" strokeWidth="1.4" />
          </svg>
          <span className="font-display font-bold text-2xl">CinMesh</span>
        </div>

        <div className="card p-6">
          <h1 className="font-display text-lg font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-[var(--text-muted)] mb-5">Log in to your B.Tech network.</p>

          {error && (
            <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
                placeholder="you@college.edu"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full mt-2">
              {submitting ? "Logging in…" : "Log in"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-5">
          New to CinMesh?{" "}
          <Link to="/register" className="text-[var(--signal)] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
