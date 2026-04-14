import { Router } from 'express';
import { updateRole, getUsers } from '../controllers/roleController.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';

const router = Router();

router.patch('/:id/role', authMiddleware, updateRole);
router.get('/', authMiddleware, getUsers);

export default router;
