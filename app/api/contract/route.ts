import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { CONTRACT_ADDRESSES, CARD_GAME_ABI } from '@/lib/contract-config';

const RPC_URL = 'https://sepolia.base.org';

// Create public client for reading blockchain data
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'mint') {
    return handleMintCard(request);
  }

  if (action === 'player-cards') {
    return handleGetPlayerCards(request);
  }

  if (action === 'player-stats') {
    return handleGetPlayerStats(request);
  }

  if (action === 'record-battle') {
    return handleRecordBattle(request);
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'leaderboard') {
    return handleGetLeaderboard(request);
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

async function handleMintCard(request: NextRequest) {
  try {
    const { name, rarity, power, traits, imageUri, walletAddress, stakeAmount } = await request.json();

    if (!CONTRACT_ADDRESSES.CardGameNFT || CONTRACT_ADDRESSES.CardGameNFT === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json(
        { error: 'Contract not deployed. Set NEXT_PUBLIC_CONTRACT_ADDRESS' },
        { status: 400 }
      );
    }

    // In production, you would use ethers.js or web3.js with the user's private key
    // For now, we'll return the transaction data for the frontend to sign
    const transactionData = {
      to: CONTRACT_ADDRESSES.CardGameNFT,
      functionName: 'mintCard',
      args: [name, rarity, power, traits, imageUri],
      value: BigInt(Math.floor(stakeAmount * 1e18)).toString(),
      walletAddress,
    };

    return NextResponse.json({
      success: true,
      txData: transactionData,
      message: 'Please sign this transaction in your wallet',
    });
  } catch (error) {
    console.error('Mint card error:', error);
    return NextResponse.json({ error: 'Failed to mint card' }, { status: 500 });
  }
}

async function handleGetPlayerCards(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!CONTRACT_ADDRESSES.CardGameNFT || CONTRACT_ADDRESSES.CardGameNFT === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json({ cards: [] });
    }

    const cardIds = (await publicClient.readContract({
      address: CONTRACT_ADDRESSES.CardGameNFT as `0x${string}`,
      abi: CARD_GAME_ABI,
      functionName: 'getPlayerCards',
      args: [address as `0x${string}`],
    })) as bigint[];

    return NextResponse.json({ cards: cardIds.map(id => id.toString()) });
  } catch (error) {
    console.error('Get player cards error:', error);
    return NextResponse.json({ error: 'Failed to fetch player cards' }, { status: 500 });
  }
}

async function handleGetPlayerStats(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!CONTRACT_ADDRESSES.CardGameNFT || CONTRACT_ADDRESSES.CardGameNFT === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json({
        player: address,
        wins: 0,
        losses: 0,
        totalEarnings: 0,
        cardsOwned: 0,
        lastBattleAt: 0,
      });
    }

    const stats = (await publicClient.readContract({
      address: CONTRACT_ADDRESSES.CardGameNFT as `0x${string}`,
      abi: CARD_GAME_ABI,
      functionName: 'getPlayerStats',
      args: [address as `0x${string}`],
    })) as any;

    return NextResponse.json({
      player: stats[0],
      wins: Number(stats[1]),
      losses: Number(stats[2]),
      totalEarnings: Number(stats[3]),
      cardsOwned: Number(stats[4]),
      lastBattleAt: Number(stats[5]),
    });
  } catch (error) {
    console.error('Get player stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch player stats' }, { status: 500 });
  }
}

async function handleGetLeaderboard(request: NextRequest) {
  try {
    if (!CONTRACT_ADDRESSES.CardGameNFT || CONTRACT_ADDRESSES.CardGameNFT === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json({ leaderboard: [] });
    }

    const leaderboard = (await publicClient.readContract({
      address: CONTRACT_ADDRESSES.CardGameNFT as `0x${string}`,
      abi: CARD_GAME_ABI,
      functionName: 'getLeaderboard',
      args: [],
    })) as any[];

    const formatted = leaderboard.map(stats => ({
      player: stats[0],
      wins: Number(stats[1]),
      losses: Number(stats[2]),
      totalEarnings: Number(stats[3]),
      cardsOwned: Number(stats[4]),
      lastBattleAt: Number(stats[5]),
    }));

    return NextResponse.json({ leaderboard: formatted });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    // Return empty leaderboard on error for better UX
    return NextResponse.json({ leaderboard: [] });
  }
}

async function handleRecordBattle(request: NextRequest) {
  try {
    const { winner, loser, stake } = await request.json();

    if (!CONTRACT_ADDRESSES.CardGameNFT || CONTRACT_ADDRESSES.CardGameNFT === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json({
        success: true,
        message: 'Battle recorded (contract not deployed)',
      });
    }

    // In production, you would sign and send the transaction
    // For now, return the transaction data for the backend to sign
    const transactionData = {
      to: CONTRACT_ADDRESSES.CardGameNFT,
      functionName: 'recordBattle',
      args: [winner, loser, stake],
    };

    return NextResponse.json({
      success: true,
      txData: transactionData,
      message: 'Battle result recorded',
    });
  } catch (error) {
    console.error('Record battle error:', error);
    return NextResponse.json({ error: 'Failed to record battle' }, { status: 500 });
  }
}
