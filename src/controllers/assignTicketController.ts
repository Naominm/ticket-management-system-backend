import { AuthRequest } from '../middlewares/authmiddleware';
import { Response } from 'express';

export const AssignTicket = (req: AuthRequest, res: Response) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong server error', err });
  }
};
