import axios from "axios";

// USE HOTSPOT IP — never 10.155.x.x
export const API_BASE = "http://10.155.209.31:3000/api";

export async function fetchStations() {
  try {
    const res = await axios.get(`${API_BASE}/stations/list39`);

    // Defensive check
    if (!res.data || !res.data.stations) {
      console.log("Station API returned invalid data:", res.data);
      return [];
    }

    return res.data.stations; // <-- ARRAY
  } catch (err) {
    console.log("Station load error:", err.message);
    return [];
  }
}

export async function fetchStationForecast(stationName) {
  try {
    const res = await fetch(`${API_BASE}/forecast/station`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ station_name: stationName }),
    });

    return await res.json(); // valid JSON
  } catch (err) {
    console.log("Forecast load error:", err.message);
    return null;
  }
}

