import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../routes/AppLayout";
import Avatar from "../components/common/Avatar";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { notificationApi } from "../services/userApi";
import { timeAgo } from "../utils/time";
import { useSocket } from "../hooks/useSocket";

const verbs = {
  like: "liked your post",
  comment: "commented on your post",
  follow: "started following you",
  message: "sent you a message",
  community: "posted in a community you follow",
};

const Notifications = () => {
  const { socket } = useSocket();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationApi.list().then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (n) => setItems((prev) => [n, ...prev]);
    socket.on("notification:new", handler);
    return () => socket.off("notification:new", handler);
  }, [socket]);

  const markAllRead = async () => {
    await notificationApi.markRead("all");
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-xl font-bold">Notifications</h1>
          {items.some((n) => !n.isRead) && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button>
          )}
        </div>

        {loading ? (
          <Loader label="Loading alerts" />
        ) : items.length === 0 ? (
          <div className="card p-8 text-center text-sm text-[var(--text-muted)]">
            Nothing yet — likes, comments, and follows will show up here.
          </div>
        ) : (
          <div className="card divide-y divide-[var(--line)]/60 overflow-hidden">
            {items.map((n) => (
              <Link
                key={n._id}
                to={n.post ? `/feed` : `/profile/${n.sender?._id}`}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-[var(--panel-raised)]/60 transition-colors ${
                  !n.isRead ? "bg-[var(--panel-raised)]/30" : ""
                }`}
              >
                <Avatar user={n.sender} size="sm" />
                <p className="text-sm flex-1">
                  <strong>{n.sender?.name}</strong> {verbs[n.type] || n.text}
                </p>
                <span className="text-[10px] text-[var(--text-faint)] font-mono-tag shrink-0">{timeAgo(n.createdAt)}</span>
                {!n.isRead && <span className="node-dot" style={{ background: "var(--signal)" }} />}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
