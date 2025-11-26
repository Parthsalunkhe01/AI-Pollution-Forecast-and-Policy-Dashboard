# Analytics Summary — Delhi AQI Insights

This report summarises key analytics findings used for the SIH presentation.

## 1. Seasonal Behaviour

- **Winter AQI** is around **285.1**, while **Summer AQI** is around **182.1** (approx values).
- This supports the classic **inversion layer effect**: in winter, the boundary layer is low, so pollutants get trapped near the ground.

## 2. Impact of Stubble Burning (Oct–Nov)

- Average AQI in **Oct–Nov** is about **290.2**, compared to **182.7** in other months.
- This is roughly a **58.9% increase** during the stubble burning season.

## 3. Traffic-Driven Spikes

- Morning peak hours (7–11 AM) show AQI ≈ **nan**.
- Evening peak hours (6–10 PM) show AQI ≈ **nan**.
- Late night / early morning (0–4 AM) AQI drops to ≈ **201.0**.
- This pattern reflects **office commute + evening return traffic**.

## 4. Role of Weather (Wind, BLH)

- Correlation between **wind speed** and AQI is ≈ **nan** (negative means higher wind → cleaner air).
- Correlation between **boundary layer height (BLH)** and AQI is ≈ **-0.18**.
- Lower BLH + low wind → pollution stagnation; higher BLH + strong winds → pollutant dispersion.

## 5. Source Attribution (Proxy Based)

- We used **Tropomi NO₂** as a proxy for **traffic and industrial emissions**.
- **Traffic proxy** = NO₂ during peak hours (7–10 AM, 6–9 PM).
- **Industrial proxy** = NO₂ during non-peak hours (steady background).
- **Stubble burning** = NASA FIRMS fire counts around Delhi–NCR.
- **Road dust** = high PM₁₀ / PM₂.₅ ratio (sudden spikes).

## 6. Takeaways for Policy and Citizens

- **Winter pollution control** needs extra measures (ban on waste burning, strict industrial checks, traffic control).
- Targeted interventions during **Oct–Nov** can reduce the spike caused by fires.
- **Traffic management** (public transport, odd-even, remote work) can flatten morning & evening peaks.
- **Wind and BLH** cannot be controlled, but forecasting them helps **prepare health advisories in advance**.
