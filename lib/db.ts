import { logger } from './logger';

// Lazy load Prisma to avoid issues during build
let prismaInstance: any = null;

function getPrismaClient() {
  if (!prismaInstance) {
    try {
      const { PrismaClient } = require('@prisma/client');
      prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
    } catch (error) {
      logger.error('Failed to initialize Prisma client', error);
      throw error;
    }
  }
  return prismaInstance;
}

export const prisma = new Proxy({} as any, {
  get(target, prop) {
    return getPrismaClient()[prop];
  },
});

// Database connection check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await getPrismaClient().$queryRaw`SELECT 1`;
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed', error);
    return false;
  }
}

// Initialize game config if not exists
export async function initializeGameConfig() {
  try {
    const existing = await getPrismaClient().gameConfig.findUnique({
      where: { id: 'default' },
    });

    if (!existing) {
      await getPrismaClient().gameConfig.create({
        data: {
          id: 'default',
          contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
          chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'),
          rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || '',
          mintPrice: '10000000000000000',
          minStake: '100000000000000000',
          maxStake: '10000000000000000000',
        },
      });
      logger.info('Game config initialized');
    }
  } catch (error) {
    logger.error('Failed to initialize game config', error);
  }
}
