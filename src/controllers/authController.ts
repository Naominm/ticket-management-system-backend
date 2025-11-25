import { Request, Response } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
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

    const JwtPayload = { id: user.id, name: user.firstName };
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
