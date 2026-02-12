import { Router } from 'express';
import { AssignTicket, getAssignedToAgent } from '../controllers/assignTicketController';
import { deleteTicket } from '../controllers/ticketController';
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
router.delete('/:id', authMiddleware, roleMiddleware(Role.ADMIN), deleteTicket);

export default router;
