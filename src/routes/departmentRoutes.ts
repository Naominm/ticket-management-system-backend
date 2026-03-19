// routes/departmentRoutes.ts

import express from 'express';
import { getAllDepartments, getDepartmentById } from '../controllers/DepartmentController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = express.Router();

router.get('/', authMiddleware, getAllDepartments);
router.get('/:id', authMiddleware, getDepartmentById);

export default router;
