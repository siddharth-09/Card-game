import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default game config
  const gameConfig = await prisma.gameConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3',
      chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'),
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org',
      mintPrice: '10000000000000000', // 0.01 ETH
      minStake: '100000000000000000', // 0.1 ETH
      maxStake: '10000000000000000000', // 10 ETH
    },
  });

  console.log('✅ Game config created:', gameConfig);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
