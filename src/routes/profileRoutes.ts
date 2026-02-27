import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);

export default router;
