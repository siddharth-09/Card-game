import { NextRequest, NextResponse } from 'next/server';
import { Card } from '@/types';

interface RoomPlayer {
  address: string;
  selectedCards: Card[];
  stakeAmount: number;
  joinedAt: number;
  totalPower: number;
  isReady: boolean;
  userName?: string;
}

interface BattleRoom {
  id: string;
  name: string;
  stakeAmount: number;
  maxPlayers: number;
  currentPlayers: number;
  players: RoomPlayer[];
  status: 'waiting' | 'ready' | 'battling' | 'completed';
  createdAt: number;
  createdBy: string;
  battleState?: {
    currentRound: number;
    playerDefeatedCount: number;
    opponentDefeatedCount: number;
    rounds: Array<{
      playerCard: any;
      opponentCard: any;
      winner: string;
      timestamp: number;
    }>;
    battleStatus: 'waiting-for-cards' | 'cards-selected' | 'revealed' | 'completed';
    winner: string | null;
    message: string;
    pendingCards?: {
      [playerAddress: string]: number; // card index
    };
  };
  battleResult?: {
    winner: string;
    loser: string;
  };
}

// Global room storage (persists across requests in same process)
const globalRooms: Map<string, BattleRoom> = new Map();

/**
 * POST /api/rooms - Create a new battle room
 */
async function createRoom(req: NextRequest) {
  try {
    const { playerAddress, stakeAmount, selectedCards } = await req.json();

    if (!playerAddress || !stakeAmount || !selectedCards) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const totalPower = selectedCards.reduce((sum: number, card: Card) => sum + card.power, 0);

    const room: BattleRoom = {
      id: roomId,
      name: `Battle Room ${roomId.slice(-6)}`,
      stakeAmount,
      maxPlayers: 2,
      currentPlayers: 1,
      players: [
        {
          address: playerAddress,
          selectedCards,
          stakeAmount,
          joinedAt: Date.now(),
          totalPower,
          isReady: false,
          userName: playerAddress.slice(0, 6),
        },
      ],
      status: 'waiting' as const,
      createdAt: Date.now(),
      createdBy: playerAddress,
    };

    globalRooms.set(roomId, room);

    console.log('[DEBUG] Created room:', roomId, 'Total rooms:', globalRooms.size);

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Create room error:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}

/**
 * GET /api/rooms - Get all available rooms or specific room
 */
async function getRoomsHandler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const roomId = url.searchParams.get('id');

    console.log('[DEBUG] GET /api/rooms - roomId param:', roomId);
    console.log('[DEBUG] Available rooms:', Array.from(globalRooms.keys()));

    if (roomId) {
      // Get specific room
      const room = globalRooms.get(roomId);
      console.log('[DEBUG] Looking for room:', roomId, 'Found:', !!room);
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
      return NextResponse.json(room, { status: 200 });
    }

    // Get all available rooms
    const availableRooms = Array.from(globalRooms.values()).filter(
      (room) => room.status === 'waiting' && room.currentPlayers < room.maxPlayers
    );

    return NextResponse.json(availableRooms, { status: 200 });
  } catch (error) {
    console.error('List rooms error:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return getRoomsHandler(request);
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  
  // POST /api/rooms - Create room
  if (!url.searchParams.has('action')) {
    return createRoom(request);
  }

  const action = url.searchParams.get('action');

  // POST /api/rooms?action=join
  if (action === 'join') {
    try {
      const { roomId, playerAddress, stakeAmount, selectedCards } = await request.json();

      const room = globalRooms.get(roomId);
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }

      if (room.currentPlayers >= room.maxPlayers) {
        return NextResponse.json({ error: 'Room is full' }, { status: 400 });
      }

      if (room.players.some((p: RoomPlayer) => p.address === playerAddress)) {
        return NextResponse.json(
          { error: 'Player already in room' },
          { status: 400 }
        );
      }

      if (stakeAmount !== room.stakeAmount) {
        return NextResponse.json(
          { error: 'Stake amount must match room stake' },
          { status: 400 }
        );
      }

      const totalPower = selectedCards.reduce((sum: number, card: Card) => sum + card.power, 0);

      room.players.push({
        address: playerAddress,
        selectedCards,
        stakeAmount,
        joinedAt: Date.now(),
        totalPower,
        isReady: false,
        userName: playerAddress.slice(0, 6),
      });

      room.currentPlayers = room.players.length;

      if (room.currentPlayers >= room.maxPlayers) {
        room.status = 'ready';
      }

      globalRooms.set(roomId, room);

      return NextResponse.json(room, { status: 200 });
    } catch (error) {
      console.error('Join room error:', error);
      return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
    }
  }

  // POST /api/rooms?action=ready
  if (action === 'ready') {
    try {
      const { roomId, playerAddress } = await request.json();

      const room = globalRooms.get(roomId);
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }

      const player = room.players.find((p: RoomPlayer) => p.address === playerAddress);
      if (!player) {
        return NextResponse.json({ error: 'Player not in room' }, { status: 404 });
      }

      player.isReady = true;

      if (room.players.every((p: RoomPlayer) => p.isReady)) {
        room.status = 'battling';

        if (room.players.length === 2) {
          const [player1, player2] = room.players;
          
          // Initialize sequential battle state
          room.battleState = {
            currentRound: 0,
            playerDefeatedCount: 0,
            opponentDefeatedCount: 0,
            rounds: [],
            battleStatus: 'waiting-for-cards',
            winner: null,
            message: 'Battle started! Both players select your first card.',
          };
        }
      }

      globalRooms.set(roomId, room);

      return NextResponse.json(room, { status: 200 });
    } catch (error) {
      console.error('Ready error:', error);
      return NextResponse.json({ error: 'Failed to mark ready' }, { status: 500 });
    }
  }

  // POST /api/rooms?action=play-card
  if (action === 'play-card') {
    try {
      const { roomId, playerAddress, cardIndex } = await request.json();

      const room = globalRooms.get(roomId);
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }

      if (!room.battleState) {
        return NextResponse.json({ error: 'Battle not in progress' }, { status: 400 });
      }

      const playerObj = room.players.find((p: RoomPlayer) => p.address === playerAddress);
      const opponentObj = room.players.find((p: RoomPlayer) => p.address !== playerAddress);

      if (!playerObj || !opponentObj) {
        return NextResponse.json({ error: 'Invalid players' }, { status: 400 });
      }

      // Initialize pendingCards if not exists
      if (!room.battleState.pendingCards) {
        room.battleState.pendingCards = {};
      }

      // Store this player's card selection
      room.battleState.pendingCards[playerAddress] = cardIndex;

      // Check if both players have selected cards
      const bothPlayersSelected = 
        room.battleState.pendingCards[playerObj.address] !== undefined && 
        room.battleState.pendingCards[opponentObj.address] !== undefined;

      if (!bothPlayersSelected) {
        // Waiting for opponent
        room.battleState.message = 'Waiting for opponent to select their card...';
        globalRooms.set(roomId, room);
        return NextResponse.json(room, { status: 200 });
      }

      // Both players selected - resolve the battle
      const playerCardIdx = room.battleState.pendingCards[playerObj.address];
      const opponentCardIdx = room.battleState.pendingCards[opponentObj.address];

      const playerCard = playerObj.selectedCards[playerCardIdx];
      const opponentCard = opponentObj.selectedCards[opponentCardIdx];

      if (!playerCard || !opponentCard) {
        return NextResponse.json({ error: 'Invalid card selection' }, { status: 400 });
      }

      // Determine winner based on power comparison with ±3% variance
      const variance = 0.03;
      const playerPowerRange = playerCard.power * variance;
      const opponentPowerRange = opponentCard.power * variance;
      
      const playerEffectivePower = playerCard.power + (Math.random() - 0.5) * 2 * playerPowerRange;
      const opponentEffectivePower = opponentCard.power + (Math.random() - 0.5) * 2 * opponentPowerRange;

      const roundWinner = playerEffectivePower > opponentEffectivePower ? playerObj.address : opponentObj.address;

      // Update battle state
      if (roundWinner === playerObj.address) {
        room.battleState.opponentDefeatedCount++;
      } else {
        room.battleState.playerDefeatedCount++;
      }

      // Record the round
      room.battleState.rounds.push({
        playerCard,
        opponentCard,
        winner: roundWinner,
        timestamp: Date.now(),
      });

      // Clear pending cards for next round
      room.battleState.pendingCards = {};

      // Check if battle is complete
      if (room.battleState.playerDefeatedCount >= 3) {
        room.battleState.winner = opponentObj.address;
        room.battleState.battleStatus = 'completed';
        room.status = 'completed';
        room.battleResult = {
          winner: opponentObj.address,
          loser: playerObj.address,
        };
        room.battleState.message = `${opponentObj.address.slice(0, 6)} Won! All your cards defeated.`;
      } else if (room.battleState.opponentDefeatedCount >= 3) {
        room.battleState.winner = playerObj.address;
        room.battleState.battleStatus = 'completed';
        room.status = 'completed';
        room.battleResult = {
          winner: playerObj.address,
          loser: opponentObj.address,
        };
        room.battleState.message = `You Won! All opponent cards defeated.`;
      } else {
        // Continue to next round
        room.battleState.currentRound++;
        room.battleState.battleStatus = 'waiting-for-cards';
        room.battleState.message = `Round ${room.battleState.currentRound + 1}/3 - Select your next card`;
      }

      globalRooms.set(roomId, room);

      return NextResponse.json(room, { status: 200 });
    } catch (error) {
      console.error('Play card error:', error);
      return NextResponse.json({ error: 'Failed to play card' }, { status: 500 });
    }
  }

  // POST /api/rooms?action=leave
  if (action === 'leave') {
    try {
      const { roomId, playerAddress } = await request.json();

      const room = globalRooms.get(roomId);
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }

      room.players = room.players.filter((p: RoomPlayer) => p.address !== playerAddress);
      room.currentPlayers = room.players.length;

      if (room.currentPlayers === 0) {
        globalRooms.delete(roomId);
      } else {
        globalRooms.set(roomId, room);
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error('Leave room error:', error);
      return NextResponse.json({ error: 'Failed to leave room' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

