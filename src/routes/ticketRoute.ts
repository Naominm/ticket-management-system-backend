import { Router } from 'express';
import { AssignTicket, getAssignedToAgent } from '../controllers/assignTicketController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();
router.put('/assign/:id', authMiddleware, AssignTicket);
router.get('/assigned/:agentId', authMiddleware, getAssignedToAgent);

export default router;
