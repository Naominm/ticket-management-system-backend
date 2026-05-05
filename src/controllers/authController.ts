import { Request, Response } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/authmiddleware';
import { Role } from '@prisma/client';
import { connect } from 'http2';
type CreateUserBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'USER' | 'AGENT' | 'ADMIN';
  department?: string;
};
export const Signup = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    if (totalUsers > 0) {
      return res.status(403).json({ message: 'Setup already complete.' });
    }
    const { firstName, lastName, email, password, role } = req.body as CreateUserBody;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exist' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    // if (totalUsers === 0) {
    //   userRole = 'ADMIN';
    // } else if (role && role !== 'USER') {
    //   const authReq = req as AuthRequest;

    //   if (!authReq.user || authReq.user.role !== 'ADMIN') {
    //     return res.status(403).json({ message: 'Only Admin can assign this role' });
    //   }

    //   userRole = role;
    // }
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (authReq.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { firstName, lastName, email, password, role, department } = req.body as CreateUserBody;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (department) {
      const dept = await prisma.department.findUnique({ where: { name: department } });
      if (!dept) {
        return res.status(400).json({ message: `Department "${department}" does not exist` });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: (role as Role) ?? 'AGENT',
        ...(department && {
          department: { connect: { name: department } },
        }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        department: { select: { id: true, name: true } },
        createdAt: true,
      },
    });
    res.status(201).json({ message: 'User Created Successfully.', user });
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong', err });
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
