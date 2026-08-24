import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppLayout from "../routes/AppLayout";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import Loader from "../components/common/Loader";
import { chatApi } from "../services/chatApi";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatApi.getMyChats().then(async ({ data }) => {
      setChats(data);
      const withUserId = searchParams.get("with");
      if (withUserId) {
        const { data: chat } = await chatApi.accessOneToOne(withUserId);
        setChats((prev) => (prev.some((c) => c._id === chat._id) ? prev : [chat, ...prev]));
        setActiveChat(chat);
      } else if (data.length > 0) {
        setActiveChat(data[0]);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      <div className="card overflow-hidden" style={{ height: "calc(100vh - 160px)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
          <div
            className={`border-r overflow-y-auto ${activeChat ? "hidden md:block" : "block"}`}
            style={{ borderColor: "var(--line)" }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--line)" }}>
              <h2 className="font-display font-semibold text-sm">Messages</h2>
            </div>
            {loading ? <Loader label="Loading chats" /> : (
              <ChatList chats={chats} activeChatId={activeChat?._id} onSelect={setActiveChat} />
            )}
          </div>

          <div className={activeChat ? "block" : "hidden md:flex md:items-center md:justify-center"}>
            {activeChat ? (
              <ChatWindow chat={activeChat} key={activeChat._id} />
            ) : (
              <p className="text-sm text-[var(--text-faint)]">Select a conversation to start chatting.</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;
