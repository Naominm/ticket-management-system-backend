import { Router } from 'express';
import { AssignTicket, getAssignedToAgent } from '../controllers/assignTicketController.js';
import { deleteTicket } from '../controllers/ticketController.js';
import { getMostActiveEmployees } from '../controllers/getMostActiveEmployee.js';
import { getMostActiveDepartments } from '../controllers/getMostDepartmentActive.js';
import { getDepartmentMonthlyPerformance } from '../controllers/DepartmentMonthlyPerfomance.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { Role } from '@prisma/client';

const router = Router();
router.put('/assign/:id', authMiddleware, roleMiddleware(Role.AGENT, Role.ADMIN), AssignTicket);
router.get(
  '/assigned/:agentId',
  authMiddleware,
  roleMiddleware(Role.AGENT, Role.ADMIN),
  getAssignedToAgent,
);
router.get(
  '/most-active-employees',
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  getMostActiveEmployees,
);
router.get(
  '/most-active-departments',
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  getMostActiveDepartments,
);
router.get(
  '/department-monthly-performance',
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  getDepartmentMonthlyPerformance,
);

router.delete('/delete/:id', authMiddleware, roleMiddleware(Role.ADMIN), deleteTicket);

export default router;
