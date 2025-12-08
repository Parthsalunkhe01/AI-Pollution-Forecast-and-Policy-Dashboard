import requests
import csv
from datetime import datetime

API_BASE = "http://10.155.209.31:3000/api"

# ------------------------------------------
# 1) Fetch 39 stations (your station list API)
# ------------------------------------------
def fetch_station_list():
    url = f"{API_BASE}/stations/list39"
    r = requests.get(url, timeout=10)
    data = r.json()

    stations = data.get("stations", [])
    # Ensure we only return clean station names
    return stations


# ------------------------------------------
# 2) Fetch real-time AQI + forecast for station
# ------------------------------------------
def fetch_station_data(station_name: str):
    url = f"{API_BASE}/forecast/station"

    try:
        r = requests.post(url, json={"station_name": station_name}, timeout=12)
        return r.json()
    except Exception as e:
        print("⚠ API error:", e)
        return None


# ------------------------------------------
# 3) Build and save CSV
# ------------------------------------------
def build_csv():
    stations = fetch_station_list()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    rows = []

    for station in stations:
        name = station["name"]   # <-- FIX HERE
        print(f"📡 Fetching {name} ...")

        res = fetch_station_data(name)

        if not res or not res.get("success"):
            print(f"   ❌ Failed for {name}")
            continue

        realtime = res.get("realtime", {})
        forecast = res.get("forecast", {})

        rows.append([
            timestamp,
            name,
            realtime.get("aqi"),
            realtime.get("category"),
            realtime.get("pm25"),
            realtime.get("pm10"),
            realtime.get("lat") or station.get("lat"),
            realtime.get("lon") or station.get("lon"),
            forecast.get("24h"),
            forecast.get("48h"),
            forecast.get("72h"),
        ])

    # SAVE CSV
    file_path = "powerbi_aqi_forecast.csv"

    with open(file_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "datetime",
            "station_name",
            "realtime_aqi",
            "category",
            "pm25",
            "pm10",
            "lat",
            "lon",
            "forecast_24h",
            "forecast_48h",
            "forecast_72h"
        ])
        writer.writerows(rows)

    print(f"\n💾 CSV generated at: {file_path}")


if __name__ == "__main__":
    build_csv()
