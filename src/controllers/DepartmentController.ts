import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/authmiddleware';

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (authReq.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { users: true, tickets: true } },
      },
    });

    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: 'Failed to fetch department' });
  }
};
