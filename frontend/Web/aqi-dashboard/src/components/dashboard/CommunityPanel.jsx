// src/components/dashboard/CommunityPanel.jsx
export default function CommunityPanel({ compact, community }) {
  if (!community) return null;
  const { news, weekly_summary, green_credits, leaderboard } = community;

  if (compact) {
    return (
      <div className="bg-slate-900 rounded-2xl p-4 shadow-lg border border-slate-800">
        <h2 className="text-sm font-semibold mb-2">This Week</h2>
        <p className="text-xs text-slate-400 mb-2">{weekly_summary?.headline}</p>
        <ul className="text-[11px] text-slate-400 space-y-1">
          {news?.slice(0, 3).map((n) => (
            <li key={n.id}>• {n.title}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-4 md:p-6 shadow-lg border border-slate-800">
      <h2 className="text-lg font-semibold mb-3">Community & Green Credits</h2>

      <div className="grid md:grid-cols-2 gap-4 text-xs">
        <div>
          <h3 className="font-semibold mb-2">Local Pollution News</h3>
          <ul className="space-y-2">
            {news?.map((n) => (
              <li key={n.id}>
                <div className="font-medium">{n.title}</div>
                <div className="text-slate-400 text-[11px]">{n.time}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold mb-1">Weekly Summary</h3>
            <p className="text-slate-400 text-xs">{weekly_summary?.detail}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Your Green Credits</h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {green_credits?.score || 0}
              </span>
              <span className="text-[11px] text-slate-400">
                {green_credits?.rank_text}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Leaderboard (Top 5)</h3>
            <ul className="space-y-1">
              {leaderboard?.slice(0, 5).map((u, idx) => (
                <li
                  key={u.user}
                  className="flex justify-between text-[11px] text-slate-300"
                >
                  <span>
                    #{idx + 1} {u.user}
                  </span>
                  <span>{u.score} pts</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
