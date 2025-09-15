import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

export const getUserFromRequest = async (request: NextRequest): Promise<{ userId: string; email: string } | null> => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  // Verify user still exists
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true }
  });

  return user ? { userId: user.id, email: user.email } : null;
};