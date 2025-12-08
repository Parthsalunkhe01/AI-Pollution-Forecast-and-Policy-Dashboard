"""
==========================================================
        SIH 2025 — Post-Model Analytics Pipeline
==========================================================

This script generates:

1. shap_insights_final.csv
2. SHAP visuals (24h/48h/72h)
3. analytics_story.md
4. dashboard_insights.json
5. Dashboard datasets:
       - daily_summary.csv
       - source_summary.csv
       - shap_summary.csv
"""

# ==============================================
# 🔵 IMPORTS
# ==============================================
import os
import json
import shap
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

plt.rcParams["figure.figsize"] = (10, 5)

# ==============================================
# 🔵 PATH CONFIGURATION
# ==============================================
BASE = "ML"
MODEL_PATH    = r"B:\SIH2\AI-Pollution-Forecast-and-Policy-Dashboard\ML\Models\xgb_multi_24_48_72.pkl"
FEATURE_PATH  = r"B:\SIH2\AI-Pollution-Forecast-and-Policy-Dashboard\ML\Models\feature_cols.pkl"
DATA_PATH     = r"B:\SIH2\AI-Pollution-Forecast-and-Policy-Dashboard\ML\final_TD\MASTER_2023_2024.csv"

OUT_BASE      = f"{BASE}/Analytics"
OUT_VIS       = f"{OUT_BASE}/shap_visuals"
OUT_DATA      = f"{OUT_BASE}/dashboard_data"

os.makedirs(OUT_BASE, exist_ok=True)
os.makedirs(OUT_VIS, exist_ok=True)
os.makedirs(OUT_DATA, exist_ok=True)

print("Output folder:", OUT_BASE)

# ==============================================
# 🔵 LOAD MODEL + FEATURES + DATA
# ==============================================
print("Loading model...")
model = joblib.load(MODEL_PATH)
m24, m48, m72 = model.estimators_

print("Loading features...")
feature_names = joblib.load(FEATURE_PATH)

print("Loading dataset...")
df = pd.read_csv(DATA_PATH)
df["date"] = pd.to_datetime(df["date"])

# ---- FIX START ----
# Identify missing feature columns
missing = [c for c in feature_names if c not in df.columns]

if missing:
    print("⚠ Missing columns:", missing)
    for col in missing:
        df[col] = np.nan   # DO NOT fill with zero

# Create X with correct feature order
X = df[feature_names].apply(pd.to_numeric, errors="coerce")

# Keep date safe
meta = df[["date"]].copy()
# ---- FIX END ----
# ==============================================
# 🔵 SHAP EXPLAINERS
# ==============================================
print("Creating SHAP explainers...")
ex24 = shap.TreeExplainer(m24)
ex48 = shap.TreeExplainer(m48)
ex72 = shap.TreeExplainer(m72)

print("Computing SHAP values...")
sh24 = ex24.shap_values(X)
sh48 = ex48.shap_values(X)
sh72 = ex72.shap_values(X)

print("Computing predictions...")
forecast = model.predict(X)
pred_df = pd.DataFrame(forecast, columns=["forecast_24h","forecast_48h","forecast_72h"])

# ==============================================
# 🔵 FEATURE → SOURCE GROUP MAPPING
# ==============================================
def map_source_group(f):
    f = f.lower()
    if "fire" in f: return "fires"
    if "no2" in f: return "traffic"
    if "pm10" in f: return "dust"
    if "pm2" in f: return "dust"
    if "blh" in f: return "weather"
    if "wind" in f: return "weather"
    if "temp" in f: return "weather"
    if "humidity" in f: return "weather"
    if "pressure" in f: return "weather"
    if "aqi" in f: return "baseline"
    return "other"

# ==============================================
# 🔵 BUILD shap_insights_final.csv
# ==============================================
print("Building shap_insights_final.csv...")

rows = []
H = ["24h","48h","72h"]
SH = [sh24, sh48, sh72]

for horizon, shap_vals in zip(H, SH):
    mean_abs = np.abs(shap_vals).mean(axis=0)
    mean_signed = shap_vals.mean(axis=0)

    for f, a, s in zip(feature_names, mean_abs, mean_signed):
        rows.append({
            "horizon": horizon,
            "feature": f,
            "mean_abs_shap": float(a),
            "mean_shap": float(s),
            "direction": "increases_aqi" if s>0 else "reduces_aqi",
            "source_group": map_source_group(f)
        })

shap_df = pd.DataFrame(rows)

TOP = (
    shap_df.sort_values(["horizon","mean_abs_shap"],ascending=[True,False])
    .groupby("horizon")
    .head(10)
    .reset_index(drop=True)
)

TOP.to_csv(f"{OUT_BASE}/shap_insights_final.csv", index=False)
print("Saved:", f"{OUT_BASE}/shap_insights_final.csv")

# ==============================================
# 🔵 SHAP VISUALS
# ==============================================
def plot_top(horizon, df, fname):
    s = df[df["horizon"]==horizon].sort_values("mean_abs_shap")
    plt.figure()
    plt.barh(s["feature"], s["mean_abs_shap"])
    plt.title(f"Top SHAP Features – {horizon}")
    plt.xlabel("mean |SHAP|")
    plt.tight_layout()
    plt.savefig(fname, dpi=300)
    plt.close()

plot_top("24h", TOP, f"{OUT_VIS}/top_features_24h.png")
plot_top("48h", TOP, f"{OUT_VIS}/top_features_48h.png")
plot_top("72h", TOP, f"{OUT_VIS}/top_features_72h.png")

print("Saved SHAP bar plots.")

# —— Source impact overall ——
src_agg = (
    shap_df.groupby("source_group")["mean_abs_shap"]
    .sum()
    .sort_values(ascending=False)
    .reset_index()
)

plt.figure()
plt.bar(src_agg["source_group"], src_agg["mean_abs_shap"])
plt.title("Source Impact (All Horizons)")
plt.xticks(rotation=30)
plt.tight_layout()
plt.savefig(f"{OUT_VIS}/source_impact_overall.png", dpi=300)
plt.close()

print("Saved source_impact_overall.png")

# ==============================================
# 🔵 BIGGEST SPIKE PLOT
# ==============================================
df2 = pd.concat([meta, pred_df], axis=1)
df2 = df2.sort_values("date").reset_index(drop=True)
df2["diff"] = df2["forecast_24h"].diff()

spike = df2["diff"].idxmax()
win = df2.iloc[max(0, spike-3): spike+2]

plt.figure()
plt.plot(win["date"], win["forecast_24h"], marker="o")
plt.axvline(df2.loc[spike, "date"], color="red", linestyle="--")
plt.title("Biggest AQI Spike (24h)")
plt.tight_layout()
plt.savefig(f"{OUT_VIS}/biggest_spike_explained.png", dpi=300)
plt.close()

print("Saved biggest_spike_explained.png")

# ==============================================
# 🔵 analytics_story.md — SIH slides content
# ==============================================
print("Building analytics_story.md...")
lines = []

lines.append("# AQI Forecast Story – Model Explanation\n")

lines.append("## Why AQI will rise tomorrow\n")
lines.append("- SHAP shows AQI roll windows + fires + low BLH are main contributors.")

lines.append("\n## Which source is responsible?\n")
for _,r in src_agg.iterrows():
    lines.append(f"- **{r['source_group']}** contributes **{r['mean_abs_shap']:.1f}** importance")

lines.append("\n## What action Govt can take today?\n")
lines.append("- If fires dominate → Punjab/Haryana coordination + GRAP")
lines.append("- If traffic dominates → restrict trucks, promote public transport")
lines.append("- If weather bad → issue advisories")

story_path = f"{OUT_BASE}/analytics_story.md"
open(story_path,"w",encoding="utf-8").write("\n".join(lines))
print("Saved:", story_path)

# ==============================================
# 🔵 DASHBOARD JSON
# ==============================================
print("Creating dashboard_insights.json...")

last = df2.iloc[-1]

# Top drivers for last row
sh_last = sh24[-1]
dr = (
    pd.DataFrame({"feature":feature_names,"shap":sh_last})
    .sort_values("shap",ascending=False).head(3)
)

key_drivers = {r.feature: float(r.shap) for _,r in dr.iterrows()}

# Source percentages
src_contrib = {}
for v,f in zip(sh_last,feature_names):
    if v>0:
        g = map_source_group(f)
        src_contrib[g] = src_contrib.get(g,0)+float(v)

tot = sum(src_contrib.values()) or 1
src_pct = {k: round(v/tot*100,1) for k,v in src_contrib.items()}

payload = {
    "date": last["date"].strftime("%Y-%m-%d"),
    "today_aqi": float(df.iloc[-1]["aqi"]) if "aqi" in df.columns else None,
    "forecast":{
        "24h": float(last["forecast_24h"]),
        "48h": float(last["forecast_48h"]),
        "72h": float(last["forecast_72h"])
    },
    "top_sources": src_pct,
    "key_drivers": key_drivers
}

json.dump(payload, open(f"{OUT_BASE}/dashboard_insights.json","w"), indent=2)
print("Saved dashboard_insights.json")

# ==============================================
# 🔵 DASHBOARD CSV: daily_summary
# ==============================================
want = ["date","forecast_24h","forecast_48h","forecast_72h"]
if "aqi" in df.columns: want.append("aqi")
for c in ["pm2.5 (µg/m³)","pm10 (µg/m³)","no2 (µg/m³)","blh_mean","ws_mean"]:
    if c in df.columns: want.append(c)

daily = df2[want].copy()
daily = daily.groupby("date").mean().reset_index()
daily.to_csv(f"{OUT_DATA}/daily_summary.csv", index=False)
print("Saved daily_summary.csv")

# ==============================================
# 🔵 DASHBOARD CSV: source_summary
# ==============================================
print("Building source_summary.csv...")

src_df = pd.DataFrame({"date":df2["date"]})

groups = {}
for i,f in enumerate(feature_names):
    g = map_source_group(f)
    groups.setdefault(g, []).append(i)

for g, idxs in groups.items():
    src_df[f"{g}_impact_24h"] = np.abs(sh24[:,idxs]).sum(axis=1)

src_df = src_df.groupby("date").mean().reset_index()
src_df.to_csv(f"{OUT_DATA}/source_summary.csv", index=False)
print("Saved source_summary.csv")

# ==============================================
# 🔵 DASHBOARD CSV: shap_summary
# ==============================================
shap_df.to_csv(f"{OUT_DATA}/shap_summary.csv", index=False)
print("Saved shap_summary.csv")

print("\n🎉 ALL ANALYTICS FILES GENERATED SUCCESSFULLY!")
