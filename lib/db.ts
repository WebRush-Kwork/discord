// This util ensures that prisma will not create its client after each hot reload
import { PrismaClient } from '@prisma/client'

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
