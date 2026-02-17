import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getMostActiveEmployees = async (req: Request, res: Response) => {
  try {
    const grouped = await prisma.ticket.groupBy({
      by: ['assignedAgentId', 'status'],
      where: {
        assignedAgentId: { not: null },
      },
      _count: {
        id: true,
      },
    });

    const stats: Record<number, { total: number; resolved: number }> = {};

    for (const row of grouped) {
      const agentId = row.assignedAgentId!;
      if (!stats[agentId]) {
        stats[agentId] = { total: 0, resolved: 0 };
      }

      stats[agentId].total += row._count.id;

      if (row.status === 'RESOLVED') {
        stats[agentId].resolved += row._count.id;
      }
    }
    const agents = await prisma.user.findMany({
      where: {
        id: { in: Object.keys(stats).map(Number) },
        role: 'AGENT',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
    const response = agents.map((agent) => {
      const data = stats[agent.id];
      const resolutionRate = data.total === 0 ? 0 : Math.round((data.resolved / data.total) * 100);

      return {
        employeeId: agent.id,
        employeeName: `${agent.firstName} ${agent.lastName}`,
        totalTickets: data.total,
        resolvedTickets: data.resolved,
        resolutionRate,
      };
    });

    response.sort((a, b) => b.totalTickets - a.totalTickets || b.resolutionRate - a.resolutionRate);

    res.status(200).json({ data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch most active employees',
    });
  }
};
