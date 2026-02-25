import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/authmiddleware';

export const updateRole = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admins can update roles' });
    }

    const { id } = req.params;
    const { role, departmentId } = req.body;

    if (!['USER', 'AGENT', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updates: any = {};
    if (role) updates.role = role;

    if (role === 'AGENT') {
      if (!departmentId) {
        return res.status(400).json({ message: 'Agent must belong to a department' });
      }
      updates.departmentId = Number(departmentId);
    }
    if (!role && departmentId) {
      updates.departmentId = Number(departmentId);
    }
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updates,
    });

    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { role } = req.query;

    const users = await prisma.user.findMany({
      where: role ? { role: role as any } : {},
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        departmentId: true,
      },
    });

    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
