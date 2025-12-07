// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import AQICard from "../components/dashboard/AQICard.jsx";
import ForecastChart from "../components/dashboard/ForecastChart.jsx";
import AnalyticsPanel from "../components/dashboard/AnalyticsPanel.jsx";
import CommunityPanel from "../components/dashboard/CommunityPanel.jsx";
import {
  fetchCurrentAQI,
  fetchForecast,
  fetchAnalyticsSummary,
  fetchCommunityData,
} from "../services/api.js";

export default function DashboardPage() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [c, f, a, comm] = await Promise.all([
          fetchCurrentAQI(),
          fetchForecast(),
          fetchAnalyticsSummary(),
          fetchCommunityData(),
        ]);
        setCurrent(c);
        setForecast(f);
        setAnalytics(a);
        setCommunity(comm);
      } catch (err) {
        console.error("Error loading dashboard", err);
      }
    })();
  }, []);

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-3">
      {/* Left column: AQI + forecast */}
      <div className="xl:col-span-2 space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AQICard current={current} />
          {/* You can add another small card for risk level, safe hours, etc. */}
          <CommunityPanel compact community={community} />
        </div>
        <ForecastChart forecast={forecast} />
      </div>

      {/* Right column: Policy analytics */}
      <div className="space-y-4 md:space-y-6">
        <AnalyticsPanel analytics={analytics} />
      </div>
    </div>
  );
}
