import { Router } from 'express';
import { getDashboard } from '../controllers/taskController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getDashboard);

export default router;
