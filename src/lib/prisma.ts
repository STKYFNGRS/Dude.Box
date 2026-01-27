import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

// Disable WebSockets and use HTTP fetch for all environments
// This avoids WebSocket connection issues in development
neonConfig.webSocketConstructor = undefined;
neonConfig.fetchConnectionCache = true;

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Use Neon adapter with HTTP fetch (no WebSockets)
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);

  return new PrismaClient({
    adapter: adapter as any,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
