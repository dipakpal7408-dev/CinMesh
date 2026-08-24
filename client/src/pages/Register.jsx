import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import { BRANCHES } from "../utils/branches";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
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
          <h1 className="font-display text-lg font-semibold mb-1">Join the network</h1>
          <p className="text-sm text-[var(--text-muted)] mb-5">Built for B.Tech students, by the mesh.</p>

          {error && (
            <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              value={form.name}
              onChange={update("name")}
              placeholder="Full name"
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
            />
            <input
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="Email"
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={update("password")}
              placeholder="Password (min 6 characters)"
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
            />
            <input
              value={form.college}
              onChange={update("college")}
              placeholder="College name"
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
            />
            <div className="flex gap-2">
              <select
                value={form.branch}
                onChange={update("branch")}
                className="flex-1 px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
              >
                <option value="">Branch</option>
                {BRANCHES.map((b) => (
                  <option key={b.code} value={b.code}>{b.code}</option>
                ))}
              </select>
              <select
                value={form.year}
                onChange={update("year")}
                className="w-28 px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
              >
                <option value="">Year</option>
                {[1, 2, 3, 4, 5].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={submitting} className="w-full mt-2">
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-5">
          Already on CinMesh?{" "}
          <Link to="/login" className="text-[var(--signal)] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
