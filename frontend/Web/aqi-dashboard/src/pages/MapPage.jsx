// src/pages/MapPage.jsx
import { useEffect, useState } from "react";
import MapView from "../components/dashboard/MapView.jsx";
import { fetchMapData } from "../services/api.js";

export default function MapPage() {
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMapData();
        setZones(data.zones);
        setReports(data.reports);
      } catch (err) {
        console.error("Error loading map data", err);
      }
    })();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <MapView zones={zones} reports={reports} />
    </div>
  );
}
