// FRONTEND-ONLY MOCK DATA (NO BACKEND REQUIRED)

export async function fetchCurrentAQI() {
  return {
    aqi: 268,
    category: "Very Poor",
    city: "Delhi",
    updated_at: new Date().toISOString()
  };
}

export async function fetchForecast() {
  return {
    points: [
      { label: "Now", aqi: 268 },
      { label: "24h", aqi: 230 },
      { label: "48h", aqi: 210 },
      { label: "72h", aqi: 240 }
    ]
  };
}

export async function fetchAnalyticsSummary() {
  return {
    source_breakdown: [
      { source: "Traffic", value: 46 },
      { source: "Industry", value: 22 },
      { source: "Dust", value: 18 },
      { source: "Biomass Burning", value: 14 }
    ],
    intervention_impact: {
      summary: "Odd-even & enforcement measures may reduce AQI by 16–22%."
    }
  };
}

export async function fetchCommunityData() {
  return {
    news: [
      { id: 1, title: "Major pollution spike near Gurgaon", time: "2h ago" },
      { id: 2, title: "Dust levels rising in Noida Sector 62", time: "5h ago" },
      { id: 3, title: "Traffic congestion contributing to AQI", time: "1 day ago" }
    ],
    weekly_summary: {
      headline: "AQI increased due to stubble burning + low wind",
      detail: "Week-on-week AQI increased by 18%. Primary contributors were low boundary layer height and increased NO₂ levels."
    },
    green_credits: { score: 1480, rank_text: "Top 25% in your city" },
    leaderboard: [
      { user: "Raj", score: 2100 },
      { user: "Simran", score: 1980 },
      { user: "Anil", score: 1900 },
      { user: "Meera", score: 1850 },
      { user: "Parth", score: 1780 }
    ]
  };
}

export async function fetchMapData() {
  return {
    zones: [
      { id: 1, name: "Punjabi Bagh", lat: 28.668, lng: 77.124, aqi: 280, category: "Poor" },
      { id: 2, name: "Anand Vihar", lat: 28.650, lng: 77.315, aqi: 320, category: "Very Poor" },
      { id: 3, name: "Rohini", lat: 28.75, lng: 77.11, aqi: 260, category: "Poor" }
    ],
    reports: [
      { id: 1, lat: 28.66, lng: 77.12, type: "Garbage burning", message: "Smoke visible" },
      { id: 2, lat: 28.71, lng: 77.15, type: "Traffic jam", message: "Heavy congestion" }
    ]
  };
}
