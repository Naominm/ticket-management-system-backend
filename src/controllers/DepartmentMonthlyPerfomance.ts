import { Response } from 'express';
import { AuthRequest } from '../middlewares/authmiddleware';
import { prisma } from '../prisma';

export const getDepartmentMonthlyPerformance = async (req: AuthRequest, res: Response) => {
  try {
    const resolvedTickets = await prisma.ticket.findMany({
      where: {
        status: 'RESOLVED',
        departmentId: { in: [1, 2, 3, 4, 5, 6] },
      },
      select: {
        departmentId: true,
        createdAt: true,
      },
    });

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthlyData: any = {};

    months.forEach((m, index) => {
      monthlyData[index] = {
        month: m,
        'IT Support': 0,
        Network: 0,
        Hardware: 0,
        Software: 0,
        Finance: 0,
        HR: 0,
        total: 0,
      };
    });
    resolvedTickets.forEach((ticket) => {
      const monthIndex = new Date(ticket.createdAt).getMonth();

      if (ticket.departmentId === 1) monthlyData[monthIndex]['IT Support']++;
      if (ticket.departmentId === 2) monthlyData[monthIndex]['Network']++;
      if (ticket.departmentId === 3) monthlyData[monthIndex]['Hardware']++;
      if (ticket.departmentId === 4) monthlyData[monthIndex]['Software']++;
      if (ticket.departmentId === 5) monthlyData[monthIndex]['Finance']++;
      if (ticket.departmentId === 6) monthlyData[monthIndex]['HR']++;

      monthlyData[monthIndex].total++;
    });

    const finalData = Object.values(monthlyData).map((m: any) => {
      if (m.total === 0) {
        return {
          month: m.month,
          'IT Support': 0,
          Network: 0,
          Hardware: 0,
          Software: 0,
          Finance: 0,
          HR: 0,
        };
      }

      return {
        month: m.month,
        'IT Support': Number(((m['IT Support'] / m.total) * 100).toFixed(1)),
        Network: Number(((m.Network / m.total) * 100).toFixed(1)),
        Hardware: Number(((m.Hardware / m.total) * 100).toFixed(1)),
        Software: Number(((m.Software / m.total) * 100).toFixed(1)),
        Finance: Number(((m.Finance / m.total) * 100).toFixed(1)),
        HR: Number(((m.HR / m.total) * 100).toFixed(1)),
      };
    });

    res.status(200).json({ data: finalData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch department performance' });
  }
};
