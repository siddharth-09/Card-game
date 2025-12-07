import { Card } from '@/types';

export interface BattleRoom {
  id: string;
  name: string;
  stakeAmount: number;
  maxPlayers: number;
  currentPlayers: number;
  players: RoomPlayer[];
  status: 'waiting' | 'battling' | 'completed';
  createdAt: number;
}

export interface RoomPlayer {
  address: string;
  selectedCards: Card[];
  stakeAmount: number;
  joinedAt: number;
  totalPower?: number;
  isReady: boolean;
}

export interface RoomBattleResult {
  roomId: string;
  winners: string[]; // Multiple winners if tie
  losers: string[];
  battleDetails: {
    [playerAddress: string]: {
      totalPower: number;
      cards: Card[];
    };
  };
  timestamp: number;
}

// Mock room storage (in real app, use backend/blockchain)
let rooms: BattleRoom[] = [];
let nextRoomId = 1;

export function createRoom(stakeAmount: number, maxPlayers: number = 2): BattleRoom {
  const room: BattleRoom = {
    id: `room-${nextRoomId++}`,
    name: `Battle Room #${nextRoomId - 1}`,
    stakeAmount,
    maxPlayers,
    currentPlayers: 0,
    players: [],
    status: 'waiting',
    createdAt: Date.now(),
  };
  rooms.push(room);
  return room;
}

export function getRooms(): BattleRoom[] {
  return rooms.filter((r) => r.status === 'waiting' || r.currentPlayers < r.maxPlayers);
}

export function getRoom(roomId: string): BattleRoom | undefined {
  return rooms.find((r) => r.id === roomId);
}

export function joinRoom(roomId: string, playerAddress: string, selectedCards: Card[], stakeAmount: number): boolean {
  const room = getRoom(roomId);
  if (!room || room.currentPlayers >= room.maxPlayers || room.status !== 'waiting') {
    return false;
  }

  const player: RoomPlayer = {
    address: playerAddress,
    selectedCards,
    stakeAmount,
    joinedAt: Date.now(),
    isReady: false,
  };

  room.players.push(player);
  room.currentPlayers++;

  return true;
}

export function markPlayerReady(roomId: string, playerAddress: string): boolean {
  const room = getRoom(roomId);
  if (!room) return false;

  const player = room.players.find((p) => p.address === playerAddress);
  if (!player) return false;

  player.isReady = true;

  // Start battle if all players are ready
  if (room.currentPlayers === room.maxPlayers && room.players.every((p) => p.isReady)) {
    room.status = 'battling';
  }

  return true;
}

export function calculateBattleResult(roomId: string): RoomBattleResult | null {
  const room = getRoom(roomId);
  if (!room || room.status !== 'battling') return null;

  const battleDetails: { [key: string]: { totalPower: number; cards: Card[] } } = {};

  // Calculate total power for each player with variance
  room.players.forEach((player) => {
    const totalPower = player.selectedCards.reduce((sum, card) => {
      const variance = card.power * (0.95 + Math.random() * 0.1);
      return sum + Math.round(variance);
    }, 0);

    battleDetails[player.address] = {
      totalPower,
      cards: player.selectedCards,
    };
  });

  // Find winner(s)
  const maxPower = Math.max(...Object.values(battleDetails).map((d) => d.totalPower));
  const winners = Object.entries(battleDetails)
    .filter(([_, d]) => d.totalPower === maxPower)
    .map(([address]) => address);

  const losers = room.players.map((p) => p.address).filter((addr) => !winners.includes(addr));

  room.status = 'completed';

  return {
    roomId,
    winners,
    losers,
    battleDetails,
    timestamp: Date.now(),
  };
}

export function leaveRoom(roomId: string, playerAddress: string): void {
  const room = getRoom(roomId);
  if (!room) return;

  const playerIndex = room.players.findIndex((p) => p.address === playerAddress);
  if (playerIndex > -1) {
    room.players.splice(playerIndex, 1);
    room.currentPlayers--;

    // Delete room if empty
    if (room.currentPlayers === 0) {
      rooms = rooms.filter((r) => r.id !== roomId);
    }
  }
}
