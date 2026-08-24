import { timeAgo } from "../../utils/time";

const Message = ({ message, isOwn }) => (
  <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
    <div
      className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
        isOwn ? "rounded-br-sm" : "rounded-bl-sm"
      }`}
      style={{
        background: isOwn ? "var(--signal-dim)" : "var(--panel-raised)",
        color: "var(--text-primary)",
      }}
    >
      {message.attachment?.url && message.attachment.type === "image" && (
        <img src={message.attachment.url} alt="" className="rounded-lg mb-1.5 max-h-56 object-cover" />
      )}
      {message.attachment?.url && message.attachment.type !== "image" && (
        <a href={message.attachment.url} target="_blank" rel="noreferrer" className="underline text-[var(--signal)] block mb-1.5">
          📎 {message.attachment.name || "Attachment"}
        </a>
      )}
      {message.text && <p className="break-words whitespace-pre-wrap">{message.text}</p>}
      <p className="text-[10px] mt-1 opacity-60 font-mono-tag text-right">{timeAgo(message.createdAt)}</p>
    </div>
  </div>
);

export default Message;
