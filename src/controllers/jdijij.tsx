import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/authmiddleware';

// GET /api/departments
export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return res.status(401).json({ message: 'Unauthorized.' });
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

    return res.status(200).json({ departments });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch departments.' });
  }
};
