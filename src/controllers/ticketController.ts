import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/authmiddleware';
import { Priority } from '@prisma/client';
import { Ticket } from '@prisma/client';

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

export const getTickets = async (req: AuthRequest, res: Response) => {
  try {
    let tickets = [];
    if (req.user.role === 'ADMIN') {
      tickets = await prisma.ticket.findMany({
        include: { user: true, assignedAgent: true, department: true },
      });
    } else if (req.user.role === 'AGENT') {
      tickets = await prisma.ticket.findMany({
        where: { assignedAgentId: req.user.id },
        include: { user: true, assignedAgent: true, department: true },
      });
    } else {
      tickets = await prisma.ticket.findMany({
        where: { userId: req.user.id },
        include: { user: true, assignedAgent: true, department: true },
      });
    }
    res.status(200).json({ tickets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTicketById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        assignedAgent: true,
        department: true,
        comments: true,
        attachments: true,
      },
    });

    if (!ticket) {
      return res.status(400).json({ message: 'No ticket found' });
    }

    if (req.user.role === 'USER' && ticket.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access Denied' });
    }
    if (req.user.role === 'AGENT' && ticket.assignedAgentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json({ ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};

export const updateTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assignedAgentId } = req.body;
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });
    if (!ticket) {
      return res.status(404).json({ message: 'Not found' });
    }
    if (req.user.role === 'USER' && ticket.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access Denied' });
    }
    if (req.user.role === 'AGENT') {
      const updated = await prisma.ticket.update({
        where: { id: Number(id) },
        data: { status, priority },
      });
      return res.status(200).json({ message: 'Ticket Updated', ticket: updated });
    }
    const updated = await prisma.ticket.update({
      where: { id: Number(id) },
      data: { title, description, status, priority, assignedAgentId },
    });
    res.status(200).json({ message: 'Ticket Updated', ticket: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};

export const deleteTicket = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access Denied' });
    }
    const { id } = req.params;
    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    await prisma.ticket.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};
