// src/components/layout/Topbar.jsx
export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between border-b border-slate-800 px-4 py-2 bg-slate-950/80 backdrop-blur">
      <div className="md:hidden font-semibold">AQI Dashboard</div>
      <div className="text-xs text-slate-400">
        Delhi–NCR • Live + Forecast • SIH 2025
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Live
      </div>
    </header>
  );
}
