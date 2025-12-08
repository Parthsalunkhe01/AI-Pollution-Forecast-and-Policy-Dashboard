import { API } from "../config";

export async function getForecast(station) {
  try {
    const res = await fetch(`${API.ML_URL}/forecast?station=${station}`);
    return await res.json();
  } catch (error) {
    console.log("Forecast API Error:", error);
    return null;
  }
}
