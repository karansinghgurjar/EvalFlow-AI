const styles = {
  DRAFT: "bg-slate-100 text-slate-700",
  ACTIVE: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-slate-200 text-slate-600",

  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  SUBMITTED: "bg-purple-100 text-purple-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",

  EASY: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HARD: "bg-red-100 text-red-700",

  ADMIN: "bg-slate-950 text-white",
  ANNOTATOR: "bg-cyan-100 text-cyan-700",
  REVIEWER: "bg-indigo-100 text-indigo-700",

  NONE: "bg-slate-100 text-slate-700",
  HALLUCINATION: "bg-orange-100 text-orange-700",
  UNSAFE: "bg-red-100 text-red-700",
  IRRELEVANT: "bg-yellow-100 text-yellow-800",
  INCOMPLETE: "bg-purple-100 text-purple-700",
  BIAS: "bg-pink-100 text-pink-700",
  OTHER: "bg-slate-100 text-slate-700",
};

function formatLabel(value) {
  if (!value) return "";

  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function Badge({ value }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[value] || "bg-slate-100 text-slate-700"
      }`}
    >
      {formatLabel(value)}
    </span>
  );
}

export default Badge;
