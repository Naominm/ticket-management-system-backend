import { Request, Response } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/authmiddleware';
import { Role } from '@prisma/client';
type signupBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'USER' | 'AGENT' | 'ADMIN';
};
export const Signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role } = req.body as signupBody;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exist' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    let userRole: 'USER' | 'AGENT' | 'ADMIN' = 'USER';
    const totalUsers = await prisma.user.count();
    if (totalUsers === 0) {
      userRole = 'ADMIN';
    } else if (role && role !== 'USER') {
      const authReq = req as AuthRequest;

      if (!authReq.user || authReq.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Only Admin can assign this role' });
      }

      userRole = role;
    }
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: userRole,
      },
    });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { identifier, password }: { identifier: string; password: string } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { firstName: identifier }],
      },
    });

    if (!user) {
      res.status(401).json({ message: 'Wrong login credentials' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Wrong login credentials' });
      return;
    }

    const JwtPayload = { id: user.id, name: user.firstName, Role: user.role };
    const token = jwt.sign(JwtPayload, process.env.JWT_SECRET as string);
    res.cookie('ticketMvp', token, { secure: false }).status(200).json({
      token,
      name: user.firstName,
      Role: user.role,
      message: 'User logged in Successfully',
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};
