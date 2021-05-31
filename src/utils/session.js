import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import { applySession as _applySession, withSession as _withSession } from 'next-session'
import prisma from './prisma'

const sessionOption = {
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 10 * 60 * 1000 // 10 minutes
  })
}

export const applySession = (req, res) => {
  return _applySession(req, res, sessionOption)
}

export const withSession = (handler) => {
  return _withSession(handler, sessionOption)
}
