// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";

const navClass =
  "block px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-60 bg-slate-950 border-r border-slate-800 p-4 gap-4">
      <div className="text-xl font-bold tracking-wide">
        AQI<span className="text-emerald-400">Insight</span>
      </div>

      <nav className="flex flex-col gap-1">
        <NavLink to="/dashboard" className={({ isActive }) =>
          `${navClass} ${isActive ? "bg-slate-800 text-emerald-300" : "text-slate-300"}`
        }>
          Dashboard
        </NavLink>
        <NavLink to="/map" className={({ isActive }) =>
          `${navClass} ${isActive ? "bg-slate-800 text-emerald-300" : "text-slate-300"}`
        }>
          AQI Map
        </NavLink>
        <NavLink to="/policy" className={({ isActive }) =>
          `${navClass} ${isActive ? "bg-slate-800 text-emerald-300" : "text-slate-300"}`
        }>
          Policy & Analytics
        </NavLink>
        <NavLink to="/community" className={({ isActive }) =>
          `${navClass} ${isActive ? "bg-slate-800 text-emerald-300" : "text-slate-300"}`
        }>
          Community
        </NavLink>
      </nav>
    </aside>
  );
}
