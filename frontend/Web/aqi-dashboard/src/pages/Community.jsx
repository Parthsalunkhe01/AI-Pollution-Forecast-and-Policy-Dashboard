// src/pages/Community.jsx
import React, { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Clock, User, CheckCircle, XCircle } from "lucide-react";

/**
 * Community page (updated)
 *
 * - LocalUpdates at top.
 * - Left: Report form + Admin pending queue (admin sees all pending).
 * - Center: 1) Your Pending Reports (top) 2) Latest community reports (approved feed).
 * - Right: AQI Hero Leaderboard + help.
 *
 * Frontend-only mock: replace with backend endpoints for production.
 */

const demoIncidents = [
  {
    id: 101,
    author: "Ravi",
    location: "Anand Vihar ISBT",
    time: "15 min ago",
    description: "Heavy dust from nearby construction affecting bus stands.",
    type: "Dust"
  },
  {
    id: 102,
    author: "Sneha",
    location: "Ring Road, AIIMS",
    time: "45 min ago",
    description: "Slow-moving traffic, visible haze over the flyover.",
    type: "Traffic"
  }
];

const demoLocalUpdates = [
  { id: "u1", title: "Tip", text: "Prefer walking/cycling on low AQI days to earn extra points!", time: "Just now" },
  { id: "u2", title: "Station", text: "New monitoring station active near Dhaula Kuan — data arriving.", time: "1 hr" },
  { id: "u3", title: "Policy", text: "Firecracker ban in effect in several zones; expect lower weekend spikes.", time: "Yesterday" }
];

const initialLeaderboard = [
  { user: "Sneha", credits: 18 },
  { user: "Ravi", credits: 14 },
  { user: "Amit", credits: 10 },
  { user: "Priya", credits: 8 }
];

export default function Community() {
  const [isAdmin, setIsAdmin] = useState(false);

  // public, approved incidents
  const [incidents, setIncidents] = useState(demoIncidents);

  // all pending reports (both user's and others)
  const [pendingReports, setPendingReports] = useState([
    {
      id: 201,
      author: "You",
      location: "Janpath Market",
      description: "Thick smoke from roadside burning, visibility low",
      time: "2 min ago"
    }
  ]);

  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  const [localUpdates, setLocalUpdates] = useState(demoLocalUpdates);
  const [activeUpdateIndex, setActiveUpdateIndex] = useState(0);

  const [form, setForm] = useState({ location: "", description: "" });
  const [currentUser] = useState({ name: "You", id: "me" });

  useEffect(() => {
    const t = setInterval(() => {
      setActiveUpdateIndex((i) => (i + 1) % localUpdates.length);
    }, 6000);
    return () => clearInterval(t);
  }, [localUpdates.length]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { location, description } = form;
    if (!location.trim() || !description.trim()) {
      alert("Please enter location and a brief description.");
      return;
    }

    const newPending = {
      id: Date.now(),
      author: currentUser.name,
      location: location.trim(),
      description: description.trim(),
      time: "Just now"
    };

    setPendingReports((p) => [newPending, ...p]);
    setForm({ location: "", description: "" });
    alert("Report submitted — it will appear after admin approval.");
  };

  // cancel your pending report
  const handleCancelPending = (id) => {
    if (!confirm("Cancel this pending report?")) return;
    setPendingReports((p) => p.filter((r) => r.id !== id));
  };

  // admin actions (mock)
  const handleApprove = (id) => {
    const pending = pendingReports.find((p) => p.id === id);
    if (!pending) return;
    const approved = {
      id: pending.id,
      author: pending.author,
      location: pending.location,
      description: pending.description,
      time: "Just now",
      type: "User report"
    };
    setIncidents((s) => [approved, ...s]);
    setPendingReports((p) => p.filter((r) => r.id !== id));

    // award credits
    setLeaderboard((lb) => {
      const idx = lb.findIndex((x) => x.user === pending.author);
      if (idx >= 0) {
        const copy = [...lb];
        copy[idx] = { ...copy[idx], credits: copy[idx].credits + 5 };
        copy.sort((a, b) => b.credits - a.credits);
        return copy;
      }
      const copy = [{ user: pending.author, credits: 5 }, ...lb];
      copy.sort((a, b) => b.credits - a.credits);
      return copy;
    });
  };

  const handleReject = (id) => {
    if (!confirm("Reject this pending report?")) return;
    setPendingReports((p) => p.filter((r) => r.id !== id));
  };

  // user's pending only
  const myPending = pendingReports.filter((p) => p.author === currentUser.name);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Community Reporting</h1>
          <p className="text-sm text-slate-500">Share on-ground pollution incidents to help others plan safer activities.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">Simulate admin</div>
          <button
            onClick={() => setIsAdmin((s) => !s)}
            className={`px-3 py-1 rounded-full text-sm ${isAdmin ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            {isAdmin ? "Admin ON" : "Admin OFF"}
          </button>
        </div>
      </div>

      {/* Local updates */}
      <div className="card p-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary-50 p-2 flex items-center justify-center" style={{ width: 44, height: 44 }}>
            <MapPin size={20} className="text-primary-600" />
          </div>
          <div>
            <div className="text-sm font-semibold">Local Updates</div>
            <div className="text-xs text-slate-500">Latest local tips, notices and incoming reports</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="relative overflow-hidden" style={{ minHeight: 48 }}>
            <div style={{ transform: `translateY(${-activeUpdateIndex * 48}px)`, transition: "transform .4s" }}>
              {localUpdates.map((u) => (
                <div key={u.id} className="flex items-center justify-between" style={{ height: 48 }}>
                  <div className="text-sm text-slate-700">
                    <strong className="mr-2 text-xs text-slate-500">{u.title}:</strong>
                    <span>{u.text}</span>
                  </div>
                  <div className="text-xs text-slate-400">{u.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400">Auto-updates</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* left: form + admin pending */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-4">
            <h2 className="text-sm font-semibold mb-2">Report an incident (pending approval)</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-medium text-slate-600">Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="input mt-1" placeholder="e.g. Dhaula Kuan flyover" />
                <div className="text-xs text-slate-400 mt-1">Auto-suggest for Delhi locations coming soon.</div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input mt-1 h-28 resize-none" placeholder="Briefly describe what you are observing..." />
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <AlertTriangle size={16} />
                <span>Submit Report</span>
              </button>
            </form>
          </div>

          {isAdmin && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Pending Reports (Admin)</h3>
                <div className="text-xs text-slate-500">{pendingReports.length} waiting</div>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto">
                {pendingReports.length === 0 && <div className="text-sm text-slate-500">No pending reports</div>}

                {pendingReports.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <User size={18} />
                        <div>
                          <div className="font-medium">{p.author}</div>
                          <div className="text-xs text-slate-500">{p.location} · <span className="ml-1 text-xs">{p.time}</span></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => handleApprove(p.id)} className="px-3 py-1 rounded bg-emerald-600 text-white text-xs flex items-center gap-2">
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button onClick={() => handleReject(p.id)} className="px-3 py-1 rounded bg-slate-100 text-xs">
                          Reject
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-slate-700">{p.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* center: user's pending (top) + latest community reports (below) */}
        <div className="lg:col-span-1 space-y-4">
          {/* Your Pending Reports */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Your Pending Reports</h3>
              <div className="text-xs text-slate-500">{myPending.length} pending</div>
            </div>

            <div className="space-y-3 max-h-[260px] overflow-y-auto">
              {myPending.length === 0 ? (
                <div className="text-sm text-slate-500">You have no pending reports. Use the form to report local incidents.</div>
              ) : (
                myPending.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{p.location}</div>
                        <div className="text-xs text-slate-500">{p.time}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-xs text-amber-600 rounded-full px-2 py-1 bg-amber-50">Pending</div>
                        <button onClick={() => handleCancelPending(p.id)} className="text-xs text-red-600 flex items-center gap-1">
                          <XCircle size={14} /> Cancel
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 mb-2">{p.description}</p>

                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <MapPin size={12} /> <span>{p.location}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest community reports (public feed) */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Latest community reports</h3>
              <div className="text-xs text-slate-500">{incidents.length} public</div>
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {incidents.length === 0 && <div className="text-sm text-slate-500">No public reports yet.</div>}

              {incidents.map((inc) => (
                <div key={inc.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{inc.type || "Report"}</span>
                      <div className="text-xs text-slate-500 ml-2">{inc.location}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={12} />
                      {inc.time}
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 mb-2">{inc.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2"><MapPin size={12} /><span>{inc.location}</span></div>
                    <div>Submitted by <strong>{inc.author}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right: leaderboard + help */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-3">AQI Hero Leaderboard</h3>
            <div className="space-y-3">
              {leaderboard.map((l, idx) => (
                <div key={l.user} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">{l.user}</div>
                      <div className="text-xs text-slate-500">Reports approved</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-600">{l.credits} pts</div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-3">Users earn green credits when their reports are approved by moderators.</p>
          </div>

          <div className="card p-3 text-sm text-slate-600">
            <div className="font-semibold mb-1">How reporting works</div>
            <ul className="list-disc pl-4 text-xs">
              <li>Reports are reviewed by moderators before going public.</li>
              <li>Approved reports award credits to the reporter.</li>
              <li>Use the form to share location & a short description.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
