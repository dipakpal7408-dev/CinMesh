const variants = {
  primary: "bg-[var(--signal)] text-[#0b1512] hover:brightness-95",
  secondary: "bg-[var(--panel-raised)] text-[var(--text-primary)] border border-[var(--line)] hover:border-[var(--signal)]",
  ghost: "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]",
  warm: "bg-[var(--wire)] text-[#2a1608] hover:brightness-95",
  danger: "bg-transparent text-[var(--danger)] border border-[var(--danger)]/40 hover:bg-[var(--danger)]/10",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  ...props
}) => {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
