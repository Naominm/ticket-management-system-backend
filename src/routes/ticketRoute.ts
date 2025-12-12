import { Router } from 'express';
import { AssignTicket } from '../controllers/assignTicketController';
import { getAssignedToAgent } from '../controllers/ticketController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();
router.put('/assign/:id', authMiddleware, AssignTicket);
router.get('/tickets/assigned/:agentId', authMiddleware, getAssignedToAgent);

export default Router;
