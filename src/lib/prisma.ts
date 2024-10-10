// import { PrismaClient } from '@prisma/client'
//
// declare global {
//   const prisma: PrismaClient | undefined
// }
//
// export const prisma =
//   global.prisma ||
//   new PrismaClient({
//     log: ['query', 'info', 'warn', 'error'],
//   })
//
// if (process.env.NODE_ENV !== 'production') global.prisma = prisma

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// npx prisma migrate dev --name update_schema

// npx prisma generate