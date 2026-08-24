import { useState, useRef } from "react";
import AppLayout from "../routes/AppLayout";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { userApi } from "../services/userApi";
import { BRANCHES } from "../utils/branches";

const Settings = () => {
  const { user, updateCachedUser } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    college: user?.college || "",
    branch: user?.branch || "",
    year: user?.year || "",
    bio: user?.bio || "",
    skills: (user?.skills || []).join(", "),
    github: user?.github || "",
    linkedin: user?.linkedin || "",
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    try {
      const payload = { ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) };
      const { data } = await userApi.updateProfile(payload);
      updateCachedUser(data);
      setSavedMsg("Profile updated.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await userApi.updateAvatar(formData);
    updateCachedUser(data);
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="font-display text-xl font-bold mb-5">Settings</h1>

        <div className="card p-6 mb-5 flex items-center gap-4">
          <Avatar user={user} size="lg" />
          <div>
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Change avatar
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </div>
        </div>

        <form onSubmit={handleSave} className="card p-6 space-y-3">
          {savedMsg && (
            <p className="text-sm text-[var(--signal)] bg-[var(--signal-dim)]/30 rounded-lg px-3 py-2">{savedMsg}</p>
          )}
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Name</label>
            <input value={form.name} onChange={update("name")} className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">College</label>
            <input value={form.college} onChange={update("college")} className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-[var(--text-muted)] block mb-1">Branch</label>
              <select value={form.branch} onChange={update("branch")} className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none">
                <option value="">—</option>
                {BRANCHES.map((b) => <option key={b.code} value={b.code}>{b.code}</option>)}
              </select>
            </div>
            <div className="w-28">
              <label className="text-xs text-[var(--text-muted)] block mb-1">Year</label>
              <select value={form.year} onChange={update("year")} className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none">
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Bio</label>
            <textarea rows={3} value={form.bio} onChange={update("bio")} className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Skills (comma separated)</label>
            <input value={form.skills} onChange={update("skills")} placeholder="React, DSA, Figma" className="w-full px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none" />
          </div>
          <div className="flex gap-2">
            <input value={form.github} onChange={update("github")} placeholder="GitHub URL" className="flex-1 px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none" />
            <input value={form.linkedin} onChange={update("linkedin")} placeholder="LinkedIn URL" className="flex-1 px-3 py-2.5 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none" />
          </div>
          <Button type="submit" disabled={saving} className="w-full mt-2">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Settings;
