// src/components/dashboard/AQICard.jsx
const getAQIColor = (aqi) => {
  if (aqi <= 50) return "bg-emerald-500";
  if (aqi <= 100) return "bg-lime-500";
  if (aqi <= 200) return "bg-yellow-400";
  if (aqi <= 300) return "bg-orange-500";
  if (aqi <= 400) return "bg-red-500";
  return "bg-purple-700";
};

export default function AQICard({ current }) {
  if (!current) return null;

  const { aqi, category, city, updated_at } = current;
  const ringColor = getAQIColor(aqi);

  return (
    <div className="bg-slate-900 rounded-2xl p-4 md:p-6 flex flex-col gap-3 shadow-lg border border-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Current AQI</h2>
          <p className="text-xs text-slate-400">{city || "Delhi–NCR"}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">
          Live
        </span>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="relative">
          <div className={`h-24 w-24 rounded-full flex items-center justify-center ${ringColor}`}>
            <div className="h-20 w-20 rounded-full bg-slate-950 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold">{Math.round(aqi)}</span>
              <span className="text-[10px] text-slate-400">AQI</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm text-slate-400 mb-1">Air Quality</p>
          <p className="text-lg font-semibold mb-2">{category}</p>
          <p className="text-xs text-slate-500">
            Updated at {new Date(updated_at).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
