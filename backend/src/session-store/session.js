import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import "dotenv/config";
import { prisma } from '../../prisma/prisma.js';

export const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,

  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  },

  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true
  })
});