import express from 'express';
import pool from '../../config/db.js';
import logger from "../../logs/logger.js";
try{
const router = express.Router();

// Test API
router.get('/ping', (req, res) => {
  res.json({ message: 'Server is running fine' });
});

// Get AQI data
router.get('/get_aqi', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aqi_data');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});
}
 catch (err) {
  logger.error(err.message);
  res.status(500).json({ error: "Server error" });
}
export default router;
