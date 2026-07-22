import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { db } from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

async function testDatabase() {
  try {
    await db.query('SELECT 1');
    console.log('MySQL Connected Successfully');
  } catch (error) {
    console.error('MySQL Connection Failed', error);
  }
}

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await testDatabase();
});
