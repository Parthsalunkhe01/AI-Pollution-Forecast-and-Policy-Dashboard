import requests
import csv
from datetime import datetime

API_BASE = "http://10.155.209.31:3000/api"

def fetch_station_list():
    r = requests.get(f"{API_BASE}/stations/list39", timeout=10)
    return r.json().get("stations", [])

def fetch_station_data(station_name: str):
    try:
        r = requests.post(
            f"{API_BASE}/forecast/station",
            json={"station_name": station_name},
            timeout=12
        )
        return r.json()
    except:
        return None

def build_source_csv():
    stations = fetch_station_list()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    rows = []

    for station in stations:
        name = station["name"]
        print(f"📡 Source → {name}")

        res = fetch_station_data(name)
        if not res or not res.get("success"):
            print(f"   ❌ Failed for {name}")
            continue

        rt = res["realtime"]

        # --------- REALTIME SOURCE FORMULAS ----------
        dust = max(rt["pm10"] - rt["pm25"], 0)
        traffic = rt["no2"] * 1.2 + rt["co"] * 0.8
        fires = rt.get("fire_count", 0)
        weather = (10 - rt["wind"]) * 2 + (rt["humidity"] / 10)
        baseline = rt["pm25"] * 0.3

        other = rt["aqi"] - (baseline + traffic + fires + dust + weather)

        rows.append([
            timestamp,
            name,
            baseline, traffic, fires, dust, weather, other
        ])

    with open("powerbi_source_realtime.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "datetime","station_name",
            "baseline","traffic","fires","dust","weather","other"
        ])
        writer.writerows(rows)

    print("💾 Source CSV saved: powerbi_source_realtime.csv")

if __name__ == "__main__":
    build_source_csv()
