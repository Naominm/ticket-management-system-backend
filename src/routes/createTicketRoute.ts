import { Router } from 'express';
import { createTicket, getTicketById, getTickets } from '../controllers/ticketController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();
router.post('/create', authMiddleware, createTicket);
router.get('/get/all', authMiddleware, getTickets);
router.get('/get/:id', authMiddleware, getTicketById);

export default router;
