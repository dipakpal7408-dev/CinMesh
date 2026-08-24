import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AppLayout from "../routes/AppLayout";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import { communityApi } from "../services/userApi";
import { useAuth } from "../hooks/useAuth";
import { BRANCHES, branchColor } from "../utils/branches";

const CATEGORIES = ["DSA", "Web Development", "AI/ML", "GATE", "Placements", "Internships", "Projects", "College-specific"];

const Communities = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", branch: "General", category: "General" });

  const branchFilter = searchParams.get("branch") || "";
  const categoryFilter = searchParams.get("category") || "";

  const load = () => {
    setLoading(true);
    communityApi
      .list({ branch: branchFilter || undefined, category: categoryFilter || undefined })
      .then(({ data }) => setCommunities(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [branchFilter, categoryFilter]);

  const handleJoin = async (id) => {
    const { joined, memberCount } = await communityApi.toggleJoin(id);
    setCommunities((prev) =>
      prev.map((c) =>
        c._id === id
          ? { ...c, members: joined ? [...c.members, user._id] : c.members.filter((m) => m !== user._id) }
          : c
      )
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await communityApi.create(form);
    setCommunities((prev) => [data, ...prev]);
    setShowCreate(false);
    setForm({ name: "", description: "", branch: "General", category: "General" });
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-display text-xl font-bold">Communities</h1>
          <Button size="sm" onClick={() => setShowCreate(true)}>New community</Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setSearchParams({})}
            className={`px-3 py-1.5 rounded-full text-xs font-mono-tag border ${!branchFilter && !categoryFilter ? "border-[var(--signal)] text-[var(--signal)]" : "border-[var(--line)] text-[var(--text-muted)]"}`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSearchParams({ category: c })}
              className={`px-3 py-1.5 rounded-full text-xs font-mono-tag border ${categoryFilter === c ? "border-[var(--signal)] text-[var(--signal)]" : "border-[var(--line)] text-[var(--text-muted)]"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader label="Loading communities" />
        ) : communities.length === 0 ? (
          <div className="card p-8 text-center text-sm text-[var(--text-muted)]">No communities match this filter yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {communities.map((c) => {
              const isMember = c.members?.includes(user?._id);
              return (
                <div key={c._id} className="card p-4" style={{ borderLeft: `3px solid ${branchColor(c.branch)}` }}>
                  <Link to={`/communities/${c.slug}`} className="font-display font-semibold hover:underline">
                    {c.name}
                  </Link>
                  <p className="text-xs text-[var(--text-faint)] font-mono-tag mt-0.5">
                    [{c.branch}] · {c.category}
                  </p>
                  <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-2">{c.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-[var(--text-faint)]">{c.members?.length || 0} members</span>
                    <Button variant={isMember ? "secondary" : "primary"} size="sm" onClick={() => handleJoin(c._id)}>
                      {isMember ? "Joined" : "Join"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Start a community">
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Community name"
            className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What's it about?"
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none resize-none"
          />
          <div className="flex gap-2">
            <select
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] outline-none"
            >
              <option value="General">General</option>
              {BRANCHES.map((b) => <option key={b.code} value={b.code}>{b.code}</option>)}
            </select>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] outline-none"
            >
              <option value="General">General</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Button type="submit" className="w-full">Create community</Button>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default Communities;
