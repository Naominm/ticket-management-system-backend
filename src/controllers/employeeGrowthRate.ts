import { prisma } from '../prisma';
import { Request, Response } from 'express';

export const getEmployeeGrowth = async (req: Request, res: Response) => {
  try {
    const growth = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: { id: true },
    });

    const monthlyData: Record<string, number> = {};
    growth.forEach((item) => {
      const month = new Date(item.createdAt).toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + item._count.id;
    });

    const chartData = Object.keys(monthlyData).map((month) => ({
      month,
      newEmployees: monthlyData[month],
    }));

    res.json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get growth' });
  }
};
