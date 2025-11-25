import { Router } from 'express';
import { createTicket } from '../controllers/ticketController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();
router.post('/create', authMiddleware, createTicket);

export default router;
