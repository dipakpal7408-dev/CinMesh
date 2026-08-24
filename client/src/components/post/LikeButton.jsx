const LikeButton = ({ liked, count, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex items-center gap-1.5 text-sm transition-colors ${
      liked ? "text-[var(--wire)]" : "text-[var(--text-muted)] hover:text-[var(--wire)]"
    }`}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.2 1.6 6.6 4.6 5.1c2.3-1.1 4.7-.2 6 1.6l1.4 1.9 1.4-1.9c1.3-1.8 3.7-2.7 6-1.6 3 1.5 3.6 5.1 1.9 7.8C18.7 16.65 12 21 12 21z" />
    </svg>
    <span>{count}</span>
  </button>
);

export default LikeButton;
