import { AuthRequest } from '../middlewares/authmiddleware';
import { Response } from 'express';
import { prisma } from '../prisma';

export const AssignTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { agentId,comment } = req.body;

    if (req.user.role !== 'AGENT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admins and agents can reassign tickets' });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: { department: true },
    });
    if (!ticket) return res.status(404).json({ message: 'Ticket Not found' });

    const targetAgent = await prisma.user.findUnique({
      where: { id: agentId },
    });
    if (!targetAgent) return res.status(404).json({ message: 'User Agent not found' });
    if (targetAgent.role !== 'AGENT')
      return res.status(404).json({ message: 'User is not an Agent' });
    if (targetAgent.departmentId !== ticket.departmentId) {
      return res.status(403).json({
        message: `Agent does not belong to the ${ticket.department.name} department`,
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: { assignedAgentId: agentId },
    });
    res.status(200).json({ message: 'Ticket successfully reassigned', ticket: updatedTicket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong Server error', err });
  }
};
