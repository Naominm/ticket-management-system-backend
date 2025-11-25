import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/authmiddleware';
import { Priority } from '@prisma/client';

type ticketBody = {
  title: string;
  description: string;
  priority?: Priority;
  departmentId: number;
};

export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, departmentId } = req.body as ticketBody;
    const userId = req.user.id;
    if (!title || !description || !departmentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        departmentId,
        userId,
        assignedAgentId: userId,
        updatedAt: new Date(),
      },
    });
    res.status(201).json({ message: 'Ticket created Successfully', ticket });
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
};
