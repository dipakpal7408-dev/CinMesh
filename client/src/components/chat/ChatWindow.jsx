import { useEffect, useRef, useState, useCallback } from "react";
import Avatar from "../common/Avatar";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { chatApi } from "../../services/chatApi";

const otherMember = (chat, myId) => chat.members.find((m) => m._id !== myId) || chat.members[0];

const ChatWindow = ({ chat }) => {
  const { user } = useAuth();
  const { socket, onlineUserIds } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  const bottomRef = useRef(null);
  const typingUserTimeout = useRef(null);

  const other = chat.isGroup ? null : otherMember(chat, user?._id);
  const isOnline = other && onlineUserIds.has(String(other._id));

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    let active = true;
    setLoading(true);
    chatApi.getMessages(chat._id).then(({ data }) => {
      if (active) {
        setMessages(data);
        setLoading(false);
        setTimeout(scrollToBottom, 50);
      }
    });
    chatApi.markSeen(chat._id);
    return () => {
      active = false;
    };
  }, [chat._id]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("chat:join", chat._id);

    const handleNewMessage = (msg) => {
      if (msg.chat !== chat._id && msg.chat?._id !== chat._id) return;
      setMessages((prev) => [...prev, msg]);
      setTimeout(scrollToBottom, 50);
    };

    const handleTypingStart = ({ chatId, userId, userName }) => {
      if (chatId !== chat._id || userId === user?._id) return;
      setTypingUser(userName);
      clearTimeout(typingUserTimeout.current);
      typingUserTimeout.current = setTimeout(() => setTypingUser(null), 2000);
    };

    const handleTypingStop = ({ chatId, userId }) => {
      if (chatId !== chat._id || userId === user?._id) return;
      setTypingUser(null);
    };

    socket.on("message:new", handleNewMessage);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.emit("chat:leave", chat._id);
      socket.off("message:new", handleNewMessage);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, chat._id, user?._id]);

  const handleSend = useCallback(
    (text) => {
      if (!socket) return;
      socket.emit(
        "message:send",
        { chatId: chat._id, text, senderId: user._id },
        (res) => {
          if (res?.success) {
            setMessages((prev) => [...prev, res.data]);
            setTimeout(scrollToBottom, 50);
          }
        }
      );
    },
    [socket, chat._id, user?._id]
  );

  const handleTyping = useCallback(
    (isTyping) => {
      if (!socket) return;
      socket.emit(isTyping ? "typing:start" : "typing:stop", {
        chatId: chat._id,
        userId: user._id,
        userName: user.name,
      });
    },
    [socket, chat._id, user]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--line)" }}>
        <Avatar user={chat.isGroup ? { name: chat.name } : other} showOnline={!chat.isGroup} isOnline={isOnline} />
        <div>
          <p className="text-sm font-semibold">{chat.isGroup ? chat.name : other?.name}</p>
          <p className="text-xs text-[var(--text-faint)]">
            {typingUser ? `${typingUser} is typing…` : chat.isGroup ? `${chat.members.length} members` : isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="text-center text-xs text-[var(--text-faint)]">Loading messages…</p>
        ) : (
          messages.map((m) => <Message key={m._id} message={m} isOwn={(m.sender?._id || m.sender) === user?._id} />)
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  );
};

export default ChatWindow;
