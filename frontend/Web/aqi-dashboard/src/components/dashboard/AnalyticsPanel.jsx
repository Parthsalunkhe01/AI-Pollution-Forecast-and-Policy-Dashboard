// src/components/dashboard/AnalyticsPanel.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#eab308", "#f97316", "#ef4444", "#8b5cf6"];

export default function AnalyticsPanel({ analytics }) {
  if (!analytics) return null;

  const { source_breakdown, intervention_impact } = analytics;

  return (
    <div className="bg-slate-900 rounded-2xl p-4 md:p-6 shadow-lg border border-slate-800">
      <h2 className="text-lg font-semibold mb-3">Source Contributions</h2>
      <p className="text-xs text-slate-400 mb-3">
        Model + SHAP based attributions for current AQI
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pie chart */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={source_breakdown}
                dataKey="value"
                nameKey="source"
                outerRadius={60}
                label
              >
                {source_breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #1f2937",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Text summary */}
        <div className="space-y-2 text-xs">
          {source_breakdown.map((s) => (
            <div
              key={s.source}
              className="flex justify-between border-b border-slate-800 pb-1"
            >
              <span className="text-slate-300">{s.source}</span>
              <span className="font-semibold">{s.value}%</span>
            </div>
          ))}
          <div className="mt-2 text-slate-400">
            {intervention_impact?.summary || "Interventions impact summary goes here."}
          </div>
        </div>
      </div>
    </div>
  );
}
