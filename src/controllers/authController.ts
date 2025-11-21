import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { todo } from 'node:test';

const prisma = new PrismaClient();

type signupBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
export const Signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body as signupBody;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exist' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
