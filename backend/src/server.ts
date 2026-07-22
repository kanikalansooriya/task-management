import express from 'express';
import bcrypt from 'bcryptjs';
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

async function initializeDatabase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        due_date DATE NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const [userRows] = await db.query('SELECT id, password FROM users WHERE email = ?', ['admin@test.com']);
    const existingUsers = userRows as Array<{ id: number; password: string }>;
    if (existingUsers.length === 0) {
      const passwordHash = bcrypt.hashSync('123456', 10);
      await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Admin User', 'admin@test.com', passwordHash]
      );
      console.log('Default admin user seeded');
    } else {
      const admin = existingUsers[0];
      if (!bcrypt.compareSync('123456', admin.password)) {
        const passwordHash = bcrypt.hashSync('123456', 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [passwordHash, admin.id]);
        console.log('Default admin password repaired');
      }
    }

    const [taskUserColumn] = await db.query(`SHOW COLUMNS FROM tasks LIKE 'user_id'`);
    const hasUserId = Array.isArray(taskUserColumn) && (taskUserColumn as any[]).length > 0;

    if (!hasUserId) {
      await db.query('ALTER TABLE tasks ADD COLUMN user_id INT NULL AFTER due_date');
      await db.query('UPDATE tasks SET user_id = 1');
      await db.query('ALTER TABLE tasks MODIFY user_id INT NOT NULL');
      console.log('Added user_id column to tasks table');
    }

    const [fkRows] = await db.query(`
      SELECT COUNT(*) AS cnt
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'tasks'
        AND COLUMN_NAME = 'user_id'
        AND REFERENCED_TABLE_NAME = 'users'
    `, [process.env.DB_NAME || 'task_management']);
    const fkCount = Array.isArray(fkRows) ? (fkRows as any[])[0]?.cnt ?? 0 : 0;

    if (fkCount === 0) {
      await db.query('ALTER TABLE tasks ADD CONSTRAINT fk_tasks_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE');
      console.log('Added foreign key constraint for tasks.user_id');
    }

    console.log('Database schema initialized');
  } catch (error) {
    console.error('Database initialization failed', error);
  }
}

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
  await initializeDatabase();
  await testDatabase();
});
