import Avatar from "../common/Avatar";
import { timeAgo } from "../../utils/time";

const Comment = ({ comment, onDelete, canDelete }) => (
  <div className="flex gap-2.5 py-2">
    <Avatar user={comment.author} size="xs" />
    <div className="flex-1 min-w-0">
      <div className="bg-[var(--panel-raised)] rounded-xl px-3 py-2">
        <p className="text-sm font-medium">{comment.author?.name}</p>
        <p className="text-sm text-[var(--text-primary)]/90 break-words">{comment.text}</p>
      </div>
      <div className="flex items-center gap-3 mt-1 px-1">
        <span className="text-xs text-[var(--text-faint)] font-mono-tag">{timeAgo(comment.createdAt)}</span>
        {canDelete && (
          <button onClick={() => onDelete?.(comment._id)} className="text-xs text-[var(--danger)] hover:underline">
            Delete
          </button>
        )}
      </div>
    </div>
  </div>
);

export default Comment;
