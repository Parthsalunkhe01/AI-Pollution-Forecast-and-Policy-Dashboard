router.post("/score", authenticateJWT, async (req, res, next) => {
  try {
    const { city, wearable } = req.body;

    const forecast = await getForecastAQI({ city });
    const aqiMax = Math.max(
      forecast.forecast["24h"],
      forecast.forecast["48h"],
      forecast.forecast["72h"]
    );

    const score = computeRiskScore({
      aqi: aqiMax,
      heartRate: wearable?.heartRate,
      steps: wearable?.steps,
      respiratoryRate: wearable?.respiratoryRate,
      hasAsthma: wearable?.hasAsthma,
    });

    let level = score >= 70 ? "high" : score >= 40 ? "medium" : "low";

    if (level === "high") {
      await prisma.notification.create({
        data: {
          userId: req.userId,
          message: "High AQI health risk detected.",
          extra: { score, aqiMax, city }
        }
      });
    }

    res.json({ score, level, aqiMax, forecast });

  } catch (err) { next(err); }
});

