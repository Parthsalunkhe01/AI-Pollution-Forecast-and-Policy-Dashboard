# GREENPULSE — System Architecture

**Project:** AI-Driven Pollution Source Identification, Forecasting and Policy Dashboard for Delhi-National Capital Region

## 1. Objective of the architecture
Provide a clear, safe, repeatable flow from data collection to forecast and user-facing visualization. The architecture is intentionally modular so each part can be tested and replaced independently.

## 2. Main Components 

### 2.1 Data Sources
- **Ground Air Quality Monitors:** Public feeds such as OpenAQ and Central Pollution Control Board containing hourly pollutant measurements (for example, particulate matter PM2.5).  
- **Satellite Hotspots and Pollutant Layers:** NASA Fire Information for Resource Management System (FIRMS) for fire hotspots and other satellite pollutant products to detect stubble burning.  
- **Weather Data:** ERA5 reanalysis for wind components, temperature, humidity, and boundary layer height.  
- **OpenStreetMap Road Network:** Road geometry that supports simple traffic index generation.  
- **Citizen Reports:** Reports submitted by users from mobile or web which include location and photo.  
- **Wearable Data (Simulated):** Heart rate and SpO2 values used in alerts for demonstration.

### 2.2 Ingestion Layer
- Small Python scripts run on a schedule to fetch:
  - Ground sensor data (`fetch_air_quality.py`) — hourly or daily.  
  - Satellite hotspots (`fetch_satellite.py`) — daily or as available.  
  - Weather data (`fetch_weather.py`) — hourly.  
- Scripts save raw files to a local `data/raw/` folder or to object storage like Amazon Simple Storage Service.

### 2.3 Storage
- **Raw Storage:** Immutable raw copies in `ML/raw/` for reproducibility.  
- **Processed Storage:** Cleaned and aligned hourly datasets in `ML/processed/`.  
- **Relational Database:** PostgreSQL stores user reports, metadata, and aggregated time-series tables. Optionally enable PostGIS for spatial queries.

### 2.4 Processing and Feature Engineering
- **Cleaning Script (`clean_data.py`):** Standardize timestamps to Coordinated Universal Time, remove or label invalid values, and resample to hourly.  
- **Feature Engineering (`features.py`):** Create lag features (for example, value at t−1 hour, t−24 hours), rolling statistics, wind component conversion, hotspot counts in the last 24 hours, and synthetic traffic indices.  
- **Scheduler:** A lightweight scheduler (for example, cron or Celery) runs ingestion and processing steps.

### 2.5 Model Training and Explainability
- **Exploratory Data Analysis:** Jupyter notebooks for visual checks and correlation analysis.  
- **Models:** Baseline models (naive and linear regression) plus a small sequence model (for example, Long Short-Term Memory or Gated Recurrent Unit) for 24–72 hour forecasts.  
- **Explainability:** Use SHapley Additive exPlanations for per-prediction contribution scores to indicate likely causes.  
- **Artifacts:** Save model binary and scaler objects to `models/` or object storage.

### 2.6 Model Serving
- **Machine Learning Service:** FastAPI application that loads the model and exposes:
  - `/forecast` — returns a 24-hour hourly prediction and uncertainty bounds.  
  - `/source_contribution` — returns top three contributing features and numeric scores.

### 2.7 Backend Application
- **Application Programming Interface Server:** Node.js or Python FastAPI that:
  - Receives and stores citizen reports.  
  - Bridges the frontend and the Machine Learning service.  
  - Manages alerting and notification rules.

### 2.8 Frontend Applications
- **Web Dashboard (React):** Shows current Air Quality Index, hourly forecast chart, source contribution chart, citizen reports, and policy analytics.  
- **Mobile Application (React Native):** Lets citizens view hyperlocal forecasts, submit reports with photos, and receive alerts.

### 2.9 Notifications and Alerts
- **Notification Provider:** Firebase Cloud Messaging or Expo Notifications for push alerts.  
- **Alert Logic:** Simple configurable rules that combine forecasted Air Quality Index and user health thresholds to trigger alerts.

### 2.10 Development and Deployment
- **Containerization:** Dockerfiles for the Machine Learning service and backend.  
- **Local Development:** docker-compose to bring up a local PostgreSQL and services.  
- **Continuous Integration:** Optional GitHub Actions to run tests and build images for staging.

## 3. Data Flow (simple step sequence)
1. Data is fetched from external sources and stored in raw storage.  
2. Cleaning and feature engineering convert raw data to a machine learning dataset.  
3. The model trains offline and saves artifacts.  
4. The Machine Learning service loads the model and provides forecast and contribution endpoints.  
5. The backend collects user reports and queries the Machine Learning service for forecasts.  
6. The frontend visualizes forecasts and reports and receives push notifications for alerts.

## 4. Security and Privacy Notes
- Do not store personally sensitive data in raw logs.  
- For demo, use simulated wearable data, and clearly mark it as simulated.  
- Use secure storage for any API keys and do not commit credentials to source control.

## 5. Minimal Infrastructure to Build the MVP
- Local development machine with Python and Node.js installed.  
- PostgreSQL running locally (or free tier managed service).  
- Optional: Amazon Simple Storage Service or use local `data/` folders for files.  
- Docker for packaging and easy sharing.

