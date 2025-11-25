import { Router } from 'express';
import { updateRole } from '../controllers/roleController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();

router.patch('/:id/role', authMiddleware, updateRole);

export default router;
