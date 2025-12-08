const API = "http://10.155.209.31:3000/api"; // Your backend

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getAQI() {
  const res = await fetch(`${API}/aqidata`);
  return res.json();
}

export async function getForecast(stationName) {
  const res = await fetch(`${API}/forecast/station?name=${stationName}`);
  return res.json();
}

export async function getReports() {
  const res = await fetch(`${API}/reports`);
  return res.json();
}

export async function createReport(data, token) {
  const res = await fetch(`${API}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
