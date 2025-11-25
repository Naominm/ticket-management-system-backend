import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

interface JwtPayload {
  id: number;
  name: string;
}

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const headerToken = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    if (!headerToken && !cookieToken) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    let token = '';
    if (headerToken && headerToken.startsWith('Bearer ')) {
      token = headerToken.split(' ')[1];
    } else {
      token = cookieToken;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
