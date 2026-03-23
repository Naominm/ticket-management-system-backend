import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/authmiddleware';

export const getUsersByDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { departmentId } = req.params;

    if (!departmentId) {
      return res.status(400).json({ message: 'departmentId is required' });
    }

    const users = await prisma.user.findMany({
      where: {
        departmentId: Number(departmentId),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
