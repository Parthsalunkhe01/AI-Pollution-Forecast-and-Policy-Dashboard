import express from "express";
import logger from "../../logs/logger.js";
try{
const router = express.Router();

// Dummy ML model output (later connect Python model or API)
router.get("/forecast", async (req, res) => {
  const mockForecast = {
    city: "Delhi",
    predicted_aqi: 260,
    category: "Poor",
    date: "2025-11-01",
  };
  res.json(mockForecast);
});
}
 catch (err) {
  logger.error(err.message);
  res.status(500).json({ error: "Server error" });
}
export default router;
