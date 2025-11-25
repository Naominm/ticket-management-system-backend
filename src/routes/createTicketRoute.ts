import { Router } from 'express';
import {
  createTicket,
  getTicketById,
  getTickets,
  updateTicket,
  deleteTicket,
} from '../controllers/ticketController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();
router.post('/', authMiddleware, createTicket);
router.get('/', authMiddleware, getTickets);
router.get('/:id', authMiddleware, getTicketById);
router.put('/:id', authMiddleware, updateTicket);
router.delete('/:id', authMiddleware, deleteTicket);

export default router;
