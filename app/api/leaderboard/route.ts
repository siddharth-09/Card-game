import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { leaderboardRateLimiter } from '@/lib/rate-limiter';

interface PlayerStats {
  address: string;
  username?: string;
  wins: number;
  losses: number;
  earnings: number;
  cardCount: number;
  winRate: number;
}

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await leaderboardRateLimiter(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    const { searchParams } = new URL(request.url);
    const playerAddress = searchParams.get('player');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (playerAddress) {
      // Get specific player stats
      const player = await prisma.player.findUnique({
        where: { address: playerAddress.toLowerCase() },
        include: {
          battlesAsWinner: true,
          battlesAsLoser: true,
          cards: true,
        },
      });

      if (!player) {
        return NextResponse.json(
          {
            address: playerAddress,
            username: undefined,
            wins: 0,
            losses: 0,
            earnings: 0,
            cardCount: 0,
            winRate: 0,
          },
          { status: 200 }
        );
      }

      const totalBattles = player.battlesAsWinner.length + player.battlesAsLoser.length;
      const winRate = totalBattles > 0 ? (player.wins / totalBattles) * 100 : 0;

      const stats: PlayerStats = {
        address: player.address,
        username: player.username || undefined,
        wins: player.wins,
        losses: player.losses,
        earnings: parseInt(player.earnings) || 0,
        cardCount: player.cards.length,
        winRate: Math.round(winRate * 100) / 100,
      };

      return NextResponse.json(stats);
    }

    // Get global leaderboard
    const players = await prisma.player.findMany({
      where: {
        wins: { gt: 0 },
      },
      orderBy: [{ wins: 'desc' }, { earnings: 'desc' }],
      take: limit,
      include: {
        battlesAsWinner: true,
        battlesAsLoser: true,
        cards: true,
      },
    });

    const leaderboard = players.map((player: any, index: number) => {
      const totalBattles = player.battlesAsWinner.length + player.battlesAsLoser.length;
      const winRate = totalBattles > 0 ? (player.wins / totalBattles) * 100 : 0;

      return {
        rank: index + 1,
        address: player.address,
        username: player.username || undefined,
        wins: player.wins,
        losses: player.losses,
        earnings: parseInt(player.earnings) || 0,
        cardCount: player.cards.length,
        winRate: Math.round(winRate * 100) / 100,
      };
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    logger.error('Leaderboard API error', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await leaderboardRateLimiter(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    const body = await request.json();
    const { playerAddress, address, username, wins, losses, earnings, cardCount } = body;

    const playerAddr = (playerAddress || address)?.toLowerCase();
    if (!playerAddr) {
      return NextResponse.json(
        { error: 'Player address is required' },
        { status: 400 }
      );
    }

    const player = await prisma.player.upsert({
      where: { address: playerAddr },
      update: {
        username: username || undefined,
        wins: wins ?? undefined,
        losses: losses ?? undefined,
        earnings: earnings ? String(Math.floor(Number(earnings))) : undefined,
        cardCount: cardCount ?? undefined,
      },
      create: {
        address: playerAddr,
        username: username || undefined,
        wins: wins || 0,
        losses: losses || 0,
        earnings: earnings ? String(Math.floor(Number(earnings))) : '0',
        cardCount: cardCount || 0,
      },
    });

    logger.info(`Player stats updated: ${playerAddr}`);

    const totalBattles = wins && losses ? wins + losses : 0;
    const winRate = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;

    return NextResponse.json(
      {
        address: player.address,
        username: player.username,
        wins: player.wins,
        losses: player.losses,
        earnings: parseInt(player.earnings) || 0,
        cardCount: player.cardCount,
        winRate: Math.round(winRate * 100) / 100,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Leaderboard update error', error);
    return NextResponse.json(
      { error: 'Failed to update leaderboard' },
      { status: 500 }
    );
  }
}
