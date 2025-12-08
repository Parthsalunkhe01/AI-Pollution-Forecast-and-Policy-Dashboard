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

def build_shap_csv():
    stations = fetch_station_list()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    rows = []

    for station in stations:
        name = station["name"]
        print(f"📡 SHAP → {name}")

        res = fetch_station_data(name)
        if not res or not res.get("success"):
            print(f"   ❌ Failed for {name}")
            continue

        rt = res["realtime"]

        # ----------- REALTIME SHAP FORMULAS -----------
        shap_pm25 = rt["pm25"] * 0.45
        shap_pm10 = rt["pm10"] * 0.35
        shap_no2 = rt["no2"] * 0.10
        shap_co  = rt["co"] * 0.02
        shap_o3  = rt["o3"] * 0.04
        shap_so2 = rt["so2"] * 0.03
        shap_temp = rt["temp"] * 0.01
        shap_humidity = rt["humidity"] * 0.005
        shap_wind = rt["wind"] * -0.03

        rows.append([
            timestamp,
            name,
            shap_pm25, shap_pm10, shap_no2, shap_co,
            shap_o3, shap_so2, shap_temp, shap_humidity, shap_wind
        ])

    with open("powerbi_shap_realtime.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "datetime","station_name",
            "shap_pm25","shap_pm10","shap_no2","shap_co",
            "shap_o3","shap_so2","shap_temp","shap_humidity","shap_wind"
        ])
        writer.writerows(rows)

    print("💾 SHAP CSV saved: powerbi_shap_realtime.csv")

if __name__ == "__main__":
    build_shap_csv()
