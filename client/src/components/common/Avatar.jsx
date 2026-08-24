import { initials } from "../../utils/branches";

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-24 h-24 text-2xl",
};

const Avatar = ({ user, size = "md", showOnline = false, isOnline = false, className = "" }) => {
  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative shrink-0 ${className}`}>
      {user?.avatar?.url ? (
        <img
          src={user.avatar.url}
          alt={user?.name || "avatar"}
          className={`${dim} rounded-full object-cover border border-[var(--line)]`}
        />
      ) : (
        <div
          className={`${dim} rounded-full flex items-center justify-center font-mono-tag font-medium border border-[var(--line)]`}
          style={{ background: "var(--panel-raised)", color: "var(--signal)" }}
        >
          {initials(user?.name) || "?"}
        </div>
      )}
      {showOnline && (
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
          style={{
            background: isOnline ? "var(--signal)" : "var(--text-faint)",
            borderColor: "var(--ink)",
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
