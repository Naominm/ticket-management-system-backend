import express from 'express';
import { getAllDepartments, getDepartmentById } from '../controllers/DepartmentController.js';
import { getUsersByDepartment } from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllDepartments);
router.get('/:departmentId/users', authMiddleware, getUsersByDepartment);
router.get('/:id', authMiddleware, getDepartmentById);

export default router;
