import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/authmiddleware';
import { Priority } from '@prisma/client';

type ticketBody = {
  title: string;
  description: string;
  priority?: Priority;
  departmentId: number;
  assignedAgentId?: number;
  comment?: string;
};

export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, departmentId, comment, assignedAgentId } =
      req.body as ticketBody;
    const userId = req.user.id;
    if (!title || !description || !departmentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const resolvedAgentId = assignedAgentId
      ? assignedAgentId
      : req.user.role === 'AGENT'
        ? userId
        : null;

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        departmentId,
        userId,
        assignedAgentId: resolvedAgentId,
        updatedAt: new Date(),
      },
    });
    let savedComment = null;
    if (comment && comment.trim() !== '') {
      savedComment = await prisma.comment.create({
        data: {
          content: comment,
          userId: req.user.id,
          ticketId: ticket.id,
        },
      });
    }
    res.status(201).json({
      message: 'Ticket created Successfully',
      ticket,
      comment: savedComment,
    });
  } catch (err) {
    console.error(err);
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
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ticket ID' });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        assignedAgent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: 'No ticket found' });
    }

    if (req.user.role === 'USER' && ticket.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    if (req.user.role === 'AGENT' && ticket.assignedAgentId !== req.user.id) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    res.status(200).json({ ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateTicket = async (req: AuthRequest, res: Response) => {
  try {
    const ticketId = Number(req.params.id);
    const { title, description, status, priority, assignedAgentId, comment } = req.body;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    let updatedTicket = null;
    let savedComment = null;

    if (req.user.role === 'USER') {
      if (ticket.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access Denied' });
      }

      updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: { title, description },
      });
    } else if (req.user.role === 'AGENT') {
      updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status,
          priority,
          ...(assignedAgentId && { assignedAgentId }),
          updatedAt: new Date(),
        },
      });
    }

    if (comment?.trim()) {
      savedComment = await prisma.comment.create({
        data: {
          content: comment.trim(),
          userId: req.user.id,
          ticketId,
        },
        include: {
          user: {
            select: {
              id: true,
              lastName: true,
              firstName: true,
              email: true,
            },
          },
        },
      });
    }

    return res.status(200).json({
      message: 'Ticket Updated',
      ticket: updatedTicket,
      comment: savedComment,
    });
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
