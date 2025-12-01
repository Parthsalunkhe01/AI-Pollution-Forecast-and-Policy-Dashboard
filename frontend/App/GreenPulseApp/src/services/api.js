// src/services/api.js

// Replace BASE_URL with your backend if available
const BASE_URL = 'https://example.com/api';

export async function fetchAQI() {
  // Mocked response for demo. Replace with real API call when backend ready:
  // return axios.get(`${BASE_URL}/aqi/nearest`).then(res => res.data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ aqi: 45, pm25: 22, pm10: 40, no2: 18, location: 'Sample Location' });
    }, 300);
  });
}
