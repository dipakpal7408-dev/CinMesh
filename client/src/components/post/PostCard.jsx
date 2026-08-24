import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import LikeButton from "./LikeButton";
import Comment from "./Comment";
import { useAuth } from "../../hooks/useAuth";
import { postApi } from "../../services/postApi";
import { branchColor } from "../../utils/branches";
import { timeAgo } from "../../utils/time";

const PostCard = ({ post, onDeleted }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes?.some((l) => (l._id || l) === user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [saved, setSaved] = useState(post.savedBy?.some((s) => (s._id || s) === user?._id));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  const accent = branchColor(post.author?.branch);

  const handleLike = async () => {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    try {
      await postApi.toggleLike(post._id);
    } catch {
      setLiked((v) => !v);
      setLikeCount((c) => (liked ? c + 1 : c - 1));
    }
  };

  const handleSave = async () => {
    setSaved((v) => !v);
    try {
      await postApi.toggleSave(post._id);
    } catch {
      setSaved((v) => !v);
    }
  };

  const loadComments = async () => {
    setShowComments((v) => !v);
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const { data } = await postApi.getComments(post._id);
        setComments(data);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await postApi.addComment(post._id, { text: commentText.trim() });
    setComments((c) => [...c, data]);
    setCommentCount((c) => c + 1);
    setCommentText("");
  };

  const handleDeleteComment = async (id) => {
    await postApi.deleteComment(id);
    setComments((c) => c.filter((x) => x._id !== id));
    setCommentCount((c) => c - 1);
  };

  const handleDeletePost = async () => {
    if (!confirm("Delete this post?")) return;
    await postApi.deletePost(post._id);
    onDeleted?.(post._id);
  };

  return (
    <article className="card overflow-hidden" style={{ borderLeft: `3px solid ${accent}` }}>
      <div className="p-4 flex items-start gap-3">
        <Link to={`/profile/${post.author?._id}`}>
          <Avatar user={post.author} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`/profile/${post.author?._id}`} className="font-semibold text-sm hover:underline">
              {post.author?.name}
            </Link>
            {post.author?.branch && (
              <span
                className="font-mono-tag text-[10px] px-1.5 py-0.5 rounded border"
                style={{ color: accent, borderColor: accent + "55" }}
              >
                [{post.author.branch}]
              </span>
            )}
            {post.community && (
              <Link
                to={`/communities/${post.community.slug}`}
                className="text-xs text-[var(--text-faint)] hover:text-[var(--signal)]"
              >
                in {post.community.name}
              </Link>
            )}
          </div>
          <p className="text-xs text-[var(--text-faint)] font-mono-tag">{timeAgo(post.createdAt)}</p>
        </div>
        {post.author?._id === user?._id && (
          <button onClick={handleDeletePost} className="text-[var(--text-faint)] hover:text-[var(--danger)] text-xs">
            Delete
          </button>
        )}
      </div>

      {post.content && (
        <p className="px-4 pb-3 text-sm leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
      )}

      {post.media?.length > 0 && (
        <div className={`grid ${post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-0.5`}>
          {post.media.map((m, i) =>
            m.type === "video" ? (
              <video key={i} src={m.url} controls className="w-full max-h-96 object-cover bg-black" />
            ) : (
              <img key={i} src={m.url} alt="" className="w-full max-h-96 object-cover" />
            )
          )}
        </div>
      )}

      <div className="px-4 py-3 flex items-center gap-5 border-t" style={{ borderColor: "var(--line)" }}>
        <LikeButton liked={liked} count={likeCount} onToggle={handleLike} />
        <button
          onClick={loadComments}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--signal)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 12a8.5 8.5 0 01-8.5 8.5H3.5L6 17.3A8.5 8.5 0 1121 12z" />
          </svg>
          <span>{commentCount}</span>
        </button>
        <button
          onClick={handleSave}
          className={`ml-auto flex items-center gap-1.5 text-sm ${saved ? "text-[var(--signal)]" : "text-[var(--text-muted)] hover:text-[var(--signal)]"}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" />
          </svg>
        </button>
      </div>

      {showComments && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--line)" }}>
          {loadingComments ? (
            <p className="text-xs text-[var(--text-faint)] py-3">Loading comments…</p>
          ) : (
            <div className="divide-y divide-[var(--line)]/60">
              {comments.map((c) => (
                <Comment
                  key={c._id}
                  comment={c}
                  canDelete={c.author?._id === user?._id}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}
          <form onSubmit={submitComment} className="flex gap-2 mt-3">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 px-3 py-2 rounded-lg text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-lg text-sm font-medium bg-[var(--signal)] text-[#0b1512]"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default PostCard;
