import { Router } from 'express';
import { getProfile } from '../controllers/profileController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();

router.get('/', authMiddleware, getProfile);

export default router;
