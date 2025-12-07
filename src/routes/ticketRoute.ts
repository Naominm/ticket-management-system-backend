import { Router } from 'express';
import { AssignTicket } from '../controllers/assignTicketController';
import { authMiddleware } from '../middlewares/authmiddleware';

const router = Router();
router.put('/assign/:id', authMiddleware, AssignTicket);

export default Router;
