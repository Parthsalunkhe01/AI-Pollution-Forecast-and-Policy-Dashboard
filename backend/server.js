import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import aqiRoutes from './src/api/routes/aqidata.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send(' Air Pollution API is Live!');
});

// Use routes
app.use('/', aqiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
