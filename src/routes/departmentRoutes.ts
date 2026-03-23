import express from 'express';
import { getAllDepartments, getDepartmentById } from '../controllers/DepartmentController';
import { getUsersByDepartment } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = express.Router();

router.get('/', authMiddleware, getAllDepartments);
router.get('/:departmentId/users', authMiddleware, getUsersByDepartment);
router.get('/:id', authMiddleware, getDepartmentById);

export default router;
