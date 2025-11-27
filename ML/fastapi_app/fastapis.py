from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import shap
import uvicorn
import os

app = FastAPI(title="AQI Forecasting API (SIH 2025)")

# ======================================================
# MODEL PATHS
# ======================================================
MODEL_PATH = r"B:\SIH2\AI-Pollution-Forecast-and-Policy-Dashboard\ML\Models\xgb_multi_24_48_72.pkl"
FEATURE_PATH = r"B:\SIH2\AI-Pollution-Forecast-and-Policy-Dashboard\ML\Models\feature_cols.pkl"


# ======================================================
# LOAD MODEL + SHAP EXPLAINER
# ======================================================
@app.on_event("startup")
def load_model():
    global model, feature_names, explainer_24, explainer_48, explainer_72

    print("🔄 Loading trained model...")
    model = joblib.load(MODEL_PATH)

    print("🔄 Loading feature list...")
    feature_names = joblib.load(FEATURE_PATH)

    print("🔄 Creating SHAP Explainers…")
    explainer_24 = shap.TreeExplainer(model.estimators_[0])
    explainer_48 = shap.TreeExplainer(model.estimators_[1])
    explainer_72 = shap.TreeExplainer(model.estimators_[2])

    print("✅ Model + SHAP loaded successfully")


# ======================================================
# INPUT FORMAT
# ======================================================
class InputData(BaseModel):
    data: dict


# ======================================================
# PREDICTION + SHAP
# ======================================================
def run_forecast_and_shap(input_dict):

    df = pd.DataFrame([input_dict], columns=feature_names)

    # Predictions
    preds = model.predict(df)[0]

    # SHAP values (per model)
    shap_24 = explainer_24.shap_values(df)[0]
    shap_48 = explainer_48.shap_values(df)[0]
    shap_72 = explainer_72.shap_values(df)[0]

    contributions = {
        "24h": {feature_names[i]: float(shap_24[i]) for i in range(len(feature_names))},
        "48h": {feature_names[i]: float(shap_48[i]) for i in range(len(feature_names))},
        "72h": {feature_names[i]: float(shap_72[i]) for i in range(len(feature_names))}
    }

    return preds, contributions


# ======================================================
# API ROUTE
# ======================================================
@app.post("/predict")
def predict(input_data: InputData):

    data = input_data.data

    for f in feature_names:
        if f not in data:
            return {"error": f"Missing feature: {f}"}

    preds, contrib = run_forecast_and_shap(data)

    return {
        "forecast": {
            "24h": float(preds[0]),
            "48h": float(preds[1]),
            "72h": float(preds[2]),
        },
        "contribution": contrib
    }


# ======================================================
# RUN SERVER
# ======================================================
if __name__ == "__main__":
    uvicorn.run("fastapis:app", host="0.0.0.0", port=8000, reload=True)
