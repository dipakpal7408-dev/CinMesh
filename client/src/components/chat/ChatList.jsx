import Avatar from "../common/Avatar";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { timeAgo } from "../../utils/time";

const otherMember = (chat, myId) => chat.members.find((m) => m._id !== myId) || chat.members[0];

const ChatList = ({ chats, activeChatId, onSelect }) => {
  const { user } = useAuth();
  const { onlineUserIds } = useSocket();

  if (chats.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-[var(--text-faint)]">
        No conversations yet. Start one from someone's profile.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[var(--line)]/60">
      {chats.map((chat) => {
        const other = chat.isGroup ? null : otherMember(chat, user?._id);
        const title = chat.isGroup ? chat.name : other?.name;
        const isOnline = other && onlineUserIds.has(String(other._id));
        const lastMsg = chat.lastMessage;

        return (
          <li key={chat._id}>
            <button
              onClick={() => onSelect(chat)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeChatId === chat._id ? "bg-[var(--panel-raised)]" : "hover:bg-[var(--panel-raised)]/60"
              }`}
            >
              <Avatar user={chat.isGroup ? { name: chat.name } : other} showOnline={!chat.isGroup} isOnline={isOnline} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{title}</p>
                <p className="text-xs text-[var(--text-faint)] truncate">
                  {lastMsg ? `${lastMsg.sender?.name?.split(" ")[0]}: ${lastMsg.text || "📎 Attachment"}` : "Say hi 👋"}
                </p>
              </div>
              {lastMsg && <span className="text-[10px] text-[var(--text-faint)] font-mono-tag">{timeAgo(lastMsg.createdAt)}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
