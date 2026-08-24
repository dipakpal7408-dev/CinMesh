export const BRANCHES = [
  { code: "CSE", label: "Computer Science", varName: "--branch-cse" },
  { code: "ECE", label: "Electronics & Comm.", varName: "--branch-ece" },
  { code: "EE", label: "Electrical", varName: "--branch-ee" },
  { code: "ME", label: "Mechanical", varName: "--branch-me" },
  { code: "CE", label: "Civil", varName: "--branch-ce" },
  { code: "IT", label: "Information Tech.", varName: "--branch-it" },
];

export const branchColor = (code) => {
  const match = BRANCHES.find((b) => b.code === code);
  return match ? `var(${match.varName})` : "var(--text-faint)";
};

export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
