import { Router } from 'express';
import { updateRole, getUsers } from '../controllers/roleController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();

router.patch('/:id/role', authMiddleware, updateRole);
router.get('/', authMiddleware, getUsers);

export default router;
