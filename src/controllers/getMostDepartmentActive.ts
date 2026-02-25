import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getMostActiveDepartments = async (req: Request, res: Response) => {
  try {
    const grouped = await prisma.ticket.groupBy({
      by: ['departmentId'],
      _count: { id: true },
      where: { status: 'RESOLVED' },
    });

    const groupedNonNull = grouped.filter((g) => g.departmentId !== null);

    if (!groupedNonNull.length) {
      return res.status(200).json({ data: [] });
    }

    const resolvedMap: Record<number, number> = {};
    groupedNonNull.forEach((g) => {
      resolvedMap[g.departmentId!] = g._count.id;
    });

    const departments = await prisma.department.findMany({
      where: { id: { in: Object.keys(resolvedMap).map(Number) } },
      select: { id: true, name: true },
    });

    const response = departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      resolvedTickets: resolvedMap[dept.id] || 0,
    }));

    response.sort((a, b) => b.resolvedTickets - a.resolvedTickets);

    res.status(200).json({ data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch most active departments' });
  }
};
