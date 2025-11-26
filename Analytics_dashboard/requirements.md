# GREENPULSE — Minimum Viable Product (MVP) Requirements

**Project Title:** AI-Driven Pollution Source Identification, Forecasting and Policy Dashboard for Delhi-NCR
 
**Date:** 2025/11/19

## 1. Project Summary (one line)
A web and mobile platform that predicts Air Quality Index for short-term horizons (24–72 hours), identifies likely pollution sources, collects community reports, and provides a policy dashboard and personalized wearable alerts for citizens and policymakers in the Delhi-National Capital Region.

## 2. Problem Statement
Delhi-National Capital Region pollution is episodic and seasonal. Multiple overlapping sources — crop stubble burning, traffic congestion, industry emissions, and weather conditions — combine to create hazardous air. Decision makers and citizens lack a simple, source-aware, and actionable tool that ties forecasts to possible causes and interventions.

## 3. Target Users
- Local citizens in Delhi-National Capital Region (mobile and web)  
- People with respiratory and cardiac conditions (wearable alerts)  
- Policymakers and municipal authorities (policy dashboard)  
- Community volunteers and non-government organizations  
- College evaluators and technical reviewers

## 4. MVP Goals
Deliver a clear, demonstrable Minimum Viable Product that:
1. Produces 24-hour hourly Air Quality Index forecasts (optionally extendable to 72-hour).  
2. Computes and displays top contributors to predicted pollution events (e.g., stubble burning, traffic, industry, meteorology) using explainable model outputs.  
3. Accepts and stores citizen reports (category, description, photo, location, timestamp).  
4. Sends wearable alerts for risk conditions based on forecast and simple health rules.  
5. Provides a minimal policy dashboard for trend visualization and intervention impact summaries.  
6. Includes a Pollution Footprint Calculator, a Local News Feed, and basic Gamification hooks as simplified features.

## 5. Features Included in MVP (freeze this list)
- **Air Quality Forecast**: Hourly predictions of PM2.5 for the next 24 hours with a simple uncertainty bound (minimum, median, maximum).  
- **Source Contribution**: For each forecast, top three contributors with numeric contribution scores and a short text explanation.  
- **Citizen Reporting**: Web and mobile endpoint to post incident reports with optional photo and location. Reports are viewable on the dashboard.  
- **Wearable Alerts**: Rule-based alerts using predicted Air Quality Index plus simulated wearable data (heart rate or SpO2) to produce a notification.  
- **Policy Dashboard**: Simple web dashboard showing current Air Quality Index, 24-hour forecast graph, source contribution bar chart, and count of citizen reports.  
- **Pollution Footprint Calculator** (Basic): Tracks simple user actions and estimates saved emissions in a straightforward points/credit system.  
- **Local Pollution News Feed** (Basic): Aggregated text feed and weekly digest (no full social features).  
- **Gamification** (Basic): Green credits and leaderboard with placeholder rewards.

## 6. Features Explicitly Excluded from the MVP
- No live streaming from real wearables (support simulated or batch upload).  
- No national-level multi-city support (single region: Delhi-National Capital Region only).  
- No complex authentication and enterprise single sign-on (simple user identifiers only).  
- No production-grade high-availability deployment or autoscaling in MVP (staging is sufficient).  
- No paid external data sources that require procurement.

## 7. Data Sources and Inputs
- **Open-source ground sensors**: OpenAQ and Central Pollution Control Board (where available).  
- **Satellite data**: NASA FIRMS (VIIRS/MODIS) and publicly available pollutant layers.  
- **Weather reanalysis**: ERA5 (via Copernicus Climate Data Store) for wind, temperature, humidity, boundary layer height.  
- **Road network**: OpenStreetMap for road geometry and synthetic traffic index.  
- **Citizen reports**: Collected via the mobile/web app.  
- **Wearable data**: Simulated device data or batch uploads from HealthKit / Google Fit for demo.

## 8. Technology Stack (recommended)
- Programming language: Python 3.x for data and model code.  
- Machine learning: PyTorch or Scikit-learn for baseline; SHAP for model explainability.  
- Model serving: FastAPI for model inference endpoints.  
- Backend application: Node.js or Python FastAPI for user/report APIs (either is acceptable).  
- Database: PostgreSQL .  
- Frontend: React for web, React Native with Expo for mobile.  
- Storage: Local files for prototype or Amazon Simple Storage Service for artifacts.  
- Containerization: Docker for packaging.

## 9. Acceptance Criteria (how we know the MVP is done)
- Forecast API returns a 24-hour hourly prediction JSON for PM2.5 with min/median/max values.  
- Source contribution API returns top three contributors for a selected forecast timestamp.  
- Citizen report endpoint accepts a report (category, description, photo link, latitude, longitude, timestamp) and the report appears in the dashboard.  
- Wearable alert can be triggered in a controlled test (simulated wearable data + forecast gives notification).  
- Policy dashboard loads and displays forecast chart and contribution bar chart with sample data.  
- A recorded 5-minute demo video shows end-to-end flow: ingestion → processing → forecast → dashboard → report → alert.

## 10. Risks and Mitigations
- **Data gaps**: Use historical OpenAQ and interpolation / synthetic filling for demo.  
- **Compute limits**: Use a simple regression or small sequence model and train on a limited time window for the MVP.  
- **Time constraints**: Freeze scope strictly to the features above.


