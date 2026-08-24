const Loader = ({ label = "Loading" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-10 text-[var(--text-muted)]">
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: "var(--signal)",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
    <span className="font-mono-tag text-xs tracking-wide">{label}</span>
  </div>
);

export default Loader;
