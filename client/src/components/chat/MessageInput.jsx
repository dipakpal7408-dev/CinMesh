import { useState, useRef } from "react";

const MessageInput = ({ onSend, onTyping }) => {
  const [text, setText] = useState("");
  const typingTimeout = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping?.(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => onTyping?.(false), 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    onTyping?.(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t" style={{ borderColor: "var(--line)" }}>
      <input
        value={text}
        onChange={handleChange}
        placeholder="Message…"
        className="flex-1 px-3.5 py-2.5 rounded-full text-sm bg-[var(--panel-raised)] border border-[var(--line)] focus:border-[var(--signal)] outline-none"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[var(--signal)] text-[#0b1512] disabled:opacity-40"
        aria-label="Send message"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 20l18-8L3 4v6l12 2-12 2v6z" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;
