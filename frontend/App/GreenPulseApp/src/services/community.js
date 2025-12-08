// src/services/community.js

const API_URL = "http://10.155.209.31:3000";

// ---------------------------------------------------
// FETCH LIVE LOCAL UPDATES
// ---------------------------------------------------
export async function apiFetchLocalUpdates() {
  try {
    const res = await fetch(`${API_URL}/api/local-updates`);
    const json = await res.json();

    console.log("🔥 LIVE UPDATES:", json);
    return json;
  } catch (err) {
    console.log("LOCAL UPDATES ERROR:", err);
    return [];
  }
}

// ---------------------------------------------------
// FETCH AQI HEROES
// ---------------------------------------------------
export async function apiFetchHeroes() {
  try {
    const res = await fetch(`${API_URL}/api/heroes`);
    const json = await res.json();

    console.log("🏆 HEROES:", json);
    return json.heroes || [];
  } catch (err) {
    console.log("HERO FETCH ERROR:", err);
    return [];
  }
}
