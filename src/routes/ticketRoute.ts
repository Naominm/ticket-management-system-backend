import { Router } from 'express';
import { AssignTicket, getAssignedToAgent } from '../controllers/assignTicketController';
import { deleteTicket } from '../controllers/ticketController';
import { getMostActiveEmployees } from '../controllers/getMostActiveEmployee';
import { getMostActiveDepartments } from '../controllers/getMostDepartmentActive';
import { getDepartmentMonthlyPerformance } from '../controllers/DepartmentMonthlyPerfomance';
import { authMiddleware } from '../middlewares/authmiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
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
