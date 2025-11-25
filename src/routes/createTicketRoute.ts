import { Router } from 'express';
import { createTicket, getTickets } from '../controllers/ticketController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();
router.post('/create', authMiddleware, createTicket);
router.get('/get/:id', authMiddleware, getTickets);

export default router;
