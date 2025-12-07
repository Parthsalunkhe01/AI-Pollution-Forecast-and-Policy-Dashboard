// src/components/dashboard/ForecastChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ForecastChart({ forecast }) {
  if (!forecast || !forecast.points) return null;

  return (
    <div className="bg-slate-900 rounded-2xl p-4 md:p-6 shadow-lg border border-slate-800">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-semibold">AQI Forecast</h2>
          <p className="text-xs text-slate-400">
            Next 24h · 48h · 72h (Model Output)
          </p>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecast.points}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
            />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #1f2937",
                fontSize: "12px",
              }}
            />
            <Line type="monotone" dataKey="aqi" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
