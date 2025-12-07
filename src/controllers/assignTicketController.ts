import { AuthRequest } from '../middlewares/authmiddleware';
import { Response } from 'express';

export const AssignTicket = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    if (req.user.role !== 'AGENT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admins and agents can reassign tickets' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong Server error', err });
  }
};
