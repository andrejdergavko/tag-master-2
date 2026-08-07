import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client';
import { getDatabaseUrl } from '../config/configService';

let prismaClient: PrismaClient | null = null;

export const getPrisma = (): PrismaClient => {
  if (!prismaClient) {
    const connectionString = getDatabaseUrl();
    if (!connectionString) {
      throw new Error('DATABASE_URL is required');
    }
    prismaClient = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    });
  }
  return prismaClient;
};

export const resetPrismaClient = (): void => {
  if (prismaClient) {
    void prismaClient.$disconnect();
    prismaClient = null;
  }
};
