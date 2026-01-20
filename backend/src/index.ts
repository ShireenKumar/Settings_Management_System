import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import settingsRoutes from './routes/settings.routes';
import { pool } from './config/database';

dotenv.config();

// Setting up app and port
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/settings', settingsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Starting the server and adding sanity checks 
const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();