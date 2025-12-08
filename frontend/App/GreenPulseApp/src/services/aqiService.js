import axios from "axios";

const BASE_URL = "http://10.155.209.31:3000/api/forecast";

export async function fetchStationForecast(stationName) {
  try {
    const res = await axios.post(`${BASE_URL}/station`, {
      station_name: stationName,
    });

    return res.data;  // full response: realtime + forecast
  } catch (err) {
    console.error("Station Forecast Error:", err.response?.data || err.message);
    return null;
  }
}
