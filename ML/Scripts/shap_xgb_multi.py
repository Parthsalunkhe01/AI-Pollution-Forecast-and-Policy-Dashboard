import shap
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import joblib
from sklearn.model_selection import train_test_split

# ======================================================
# 1) LOAD MODEL + FEATURE COLUMNS
# ======================================================
print("🔄 Loading MultiOutputRegressor model...")
model = joblib.load(r"B:\SIH2\AI-Pollution-Forecast-and-Policy-Dashboard\ML\Models\xgb_multi_24_48_72.pkl")

# Extract the 3 fitted XGBRegressor models
est_24h, est_48h, est_72h = model.estimators_

print("Loaded submodels:")
print("24h:", type(est_24h))
print("48h:", type(est_48h))
print("72h:", type(est_72h))

print("\nLoading feature columns...")
feature_names = joblib.load(r"B:\SIH2\AI-Pollution-Forecast-and-Policy-Dashboard\ML\Models\feature_cols.pkl")

# ======================================================
# 2) LOAD MASTER DATASET
# ======================================================
df = pd.read_csv(
    r"B:\SIH2\AI-Pollution-Forecast-and-Policy-Dashboard\ML\Training_Data\Final_Training_Dataset\MASTER_2023_2024.csv",
    low_memory=False
)

# Ensure station_code exists
if "station_code" not in df.columns:
    station_to_code = joblib.load(r"B:\SIH2\AI-Pollution-Forecast-and-Policy-Dashboard\ML\Models\station_to_code.pkl")
    df["station_code"] = df["station"].map(station_to_code).fillna(-1)

# Use ONLY required feature columns
X = df[feature_names].apply(pd.to_numeric, errors="coerce")

# Create SHAP validation dataset
_, X_val = train_test_split(X, test_size=0.2, shuffle=False)
print("Validation shape:", X_val.shape)

# ======================================================
# 3) SHAP EXPLAINERS FOR EACH MODEL
# ======================================================
print("Creating SHAP explainers...")

expl_24 = shap.TreeExplainer(est_24h)
expl_48 = shap.TreeExplainer(est_48h)
expl_72 = shap.TreeExplainer(est_72h)

print("Computing SHAP values...")

shap_24 = expl_24.shap_values(X_val)
shap_48 = expl_48.shap_values(X_val)
shap_72 = expl_72.shap_values(X_val)

# ======================================================
# 4) EXPORT FEATURE IMPORTANCE AS CSV
# ======================================================
print("Exporting feature importance CSV...")

horizons = ["24h", "48h", "72h"]
shap_list = [shap_24, shap_48, shap_72]
importance_data = []

for shap_vals, horizon in zip(shap_list, horizons):
    abs_mean = np.abs(shap_vals).mean(axis=0)
    df_imp = pd.DataFrame({
        "feature": feature_names,
        "importance": abs_mean,
        "horizon": horizon
    }).sort_values("importance", ascending=False)

    importance_data.append(df_imp)

final_df = pd.concat(importance_data)
final_df.to_csv("SHAP_feature_importance.csv", index=False)

print("🎉 Saved → SHAP_feature_importance.csv")

# ======================================================
# 5) SHAP PLOTS
# ======================================================
print("Generating summary plots...")

for shap_vals, horizon in zip(shap_list, horizons):
    shap.summary_plot(shap_vals, X_val, feature_names=feature_names, show=False)
    plt.savefig(f"SHAP_summary_{horizon}.png", dpi=300)
    plt.close()

print("🎉 SHAP plots saved (24h/48h/72h)")
