// frontend/src/services/routeService.js
import { API } from "../config";

export async function getSafeRoute(origin, destination) {
  try {
    const res = await fetch(`${API.NODE_URL}/api/safe-route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination }),
    });

    return await res.json();
  } catch (err) {
    console.log("Safe Route API Error:", err);
    return null;
  }
}
