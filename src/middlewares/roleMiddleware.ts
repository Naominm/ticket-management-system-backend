import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authmiddleware';
import { Role } from '@prisma/client';

export const roleMiddleware = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};
