import { Router } from 'express';
import { getEmployeeGrowth } from '../controllers/employeeGrowthRate.js';

const router = Router();

router.get('/employee-growth', getEmployeeGrowth);

export default router;
