import { useState, useRef } from "react";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
import { postApi } from "../../services/postApi";

const PostForm = ({ communityId, onCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (e) => {
    const chosen = Array.from(e.target.files).slice(0, 4);
    setFiles(chosen);
    setPreviews(chosen.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (communityId) formData.append("community", communityId);
      files.forEach((f) => formData.append("media", f));

      const { data } = await postApi.createPost(formData);
      onCreated?.(data);
      setContent("");
      setFiles([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <div className="flex gap-3">
        <Avatar user={user} size="md" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What are you building, debugging, or wondering about?"
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-sm placeholder:text-[var(--text-faint)]"
          />
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {previews.map((p, i) => (
                <img key={i} src={p} alt="" className="w-full h-20 object-cover rounded-lg border border-[var(--line)]" />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "var(--line)" }}>
            <label className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--signal)] text-sm flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              Media
              <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple hidden onChange={handleFiles} />
            </label>
            <Button type="submit" disabled={submitting || (!content.trim() && files.length === 0)} size="sm">
              {submitting ? "Posting…" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
