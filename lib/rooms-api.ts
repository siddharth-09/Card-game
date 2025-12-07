/**
 * Real-time multiplayer room system with API backend
 * This handles actual player interactions and WebSocket events
 */

import { Card } from '@/types';

export interface RoomPlayer {
  address: string;
  selectedCards: Card[];
  stakeAmount: number;
  joinedAt: number;
  totalPower: number;
  isReady: boolean;
  userName?: string;
}

export interface BattleRoom {
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
      playerCard: Card;
      opponentCard: Card;
      winner: string;
      timestamp: number;
    }>;
    battleStatus: 'waiting-for-cards' | 'cards-selected' | 'revealed' | 'completed';
    winner: string | null;
    message: string;
  };
  battleResult?: {
    winner: string;
    loser: string;
  };
}

const API_BASE = '/api/rooms';

/**
 * Create a new battle room
 */
export async function createRoomAPI(
  playerAddress: string,
  stakeAmount: number,
  selectedCards: Card[]
): Promise<BattleRoom> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerAddress,
      stakeAmount,
      selectedCards,
    }),
  });

  if (!response.ok) throw new Error('Failed to create room');
  return response.json();
}

/**
 * Get all available rooms
 */
export async function getRoomsAPI(): Promise<BattleRoom[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error('Failed to fetch rooms');
  return response.json();
}

/**
 * Get a specific room by ID
 */
export async function getRoomAPI(roomId: string): Promise<BattleRoom> {
  const response = await fetch(`${API_BASE}?id=${roomId}`);
  if (!response.ok) throw new Error('Room not found');
  return response.json();
}

/**
 * Join an existing room
 */
export async function joinRoomAPI(
  roomId: string,
  playerAddress: string,
  stakeAmount: number,
  selectedCards: Card[]
): Promise<BattleRoom> {
  const response = await fetch(`${API_BASE}?action=join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomId,
      playerAddress,
      stakeAmount,
      selectedCards,
    }),
  });

  if (!response.ok) throw new Error('Failed to join room');
  return response.json();
}

/**
 * Mark player as ready to battle
 */
export async function markPlayerReadyAPI(
  roomId: string,
  playerAddress: string
): Promise<BattleRoom> {
  const response = await fetch(`${API_BASE}?action=ready`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId, playerAddress }),
  });

  if (!response.ok) throw new Error('Failed to mark ready');
  return response.json();
}

/**
 * Leave a room
 */
export async function leaveRoomAPI(
  roomId: string,
  playerAddress: string
): Promise<void> {
  const response = await fetch(`${API_BASE}?action=leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId, playerAddress }),
  });

  if (!response.ok) throw new Error('Failed to leave room');
}

/**
 * Play a card in the battle
 */
export async function playCardAPI(
  roomId: string,
  playerAddress: string,
  cardIndex: number
): Promise<BattleRoom> {
  const response = await fetch(`${API_BASE}?action=play-card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomId,
      playerAddress,
      cardIndex,
    }),
  });

  if (!response.ok) throw new Error('Failed to play card');
  return response.json();
}

