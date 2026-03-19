// routes/departmentRoutes.ts

import express from 'express';
import { getAllDepartments, getDepartmentById } from '../controllers/DepartmentController';

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);

export default router;
