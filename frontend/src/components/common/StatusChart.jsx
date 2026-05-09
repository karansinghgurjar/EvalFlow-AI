import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "./Card";

const COLORS = {
  PENDING: "#ca8a04",
  IN_PROGRESS: "#2563eb",
  SUBMITTED: "#9333ea",
  APPROVED: "#16a34a",
  REJECTED: "#dc2626",
  DRAFT: "#64748b",
  ACTIVE: "#2563eb",
  COMPLETED: "#16a34a",
  ARCHIVED: "#64748b",
};

function formatLabel(value) {
  if (!value) return "";

  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function StatusChart({ title, data = [], type = "bar" }) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatLabel(item.status),
  }));

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>

      {chartData.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No chart data available.</p>
      ) : (
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            {type === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="label"
                  outerRadius={90}
                  label
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={COLORS[entry.status] || "#0f172a"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={COLORS[entry.status] || "#0f172a"}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

export default StatusChart;
