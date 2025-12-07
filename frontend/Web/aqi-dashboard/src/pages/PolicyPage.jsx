// src/pages/PolicyPage.jsx
export default function PolicyPage() {
  const powerBiUrl = "https://app.powerbi.com/view?r=YOUR_EMBED_ID"; // from Power BI

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-slate-900 rounded-2xl p-4 md:p-6 border border-slate-800">
        <h2 className="text-lg font-semibold mb-3">Policy Dashboard</h2>
        <p className="text-xs text-slate-400 mb-3">
          Interventions, scenario analysis and trends (Power BI Embed)
        </p>
        <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-800">
          <iframe
            title="Policy Dashboard"
            src={powerBiUrl}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
