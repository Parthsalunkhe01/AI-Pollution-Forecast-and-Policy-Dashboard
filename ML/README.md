## 26/11/2025

# Backend Developer Guide — ML Integration (SIH 2025)

This project uses a Machine Learning (ML) model to forecast Delhi AQI for the
next **24h, 48h, and 72h**.  
ML is already trained and deployed through a **FastAPI service**.  
Your job as a backend developer is to **call** this ML service, not retrain it.

This guide explains everything needed to integrate the ML outputs
into the Express.js backend.

---

# 📌 1. ML Service Overview

The ML model is exposed through a FastAPI endpoint:

### **POST /predict**

It returns two things:

1. **AQI Forecast**  
   - 24-hour AQI  
   - 48-hour AQI  
   - 72-hour AQI  

2. **SHAP Contribution (Why AQI changes)**  
   - Shows which features (PM2.5, PM10, weather, fires, etc.) affect the AQI.

Example response:
```json
{
  "forecast": {
    "24h": 287.4,
    "48h": 301.8,
    "72h": 315.2
  },
  "contribution": {
    "24h": { "pm25": 22.1, "fire_count": 10.2, "wind_speed": -3.5 },
    "48h": { ... },
    "72h": { ... }
  }
}



## 19/11/2025 

## Steps For Analytics Developer.

## All datasets are in RAW folder.

## Clean,processed,eda,feature selection.So data should be completely turn into processesable data.

## Save processed date into processed folder.

## Try to complete it by tommorrow.


## Types of data:

## Air_Quality_Data -> CPCB 
## CCR_DATA_2023_25 -> CPCB(Air pollutants)
## Stubble_Burning -> viirs for fire tracking (modis is not pefer due to low accuracy)
## TROPOMI -> traffic + industrial pollutant mostly( NO2) data
## Weather_Data -> ERP data
