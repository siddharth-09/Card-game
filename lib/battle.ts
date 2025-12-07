import { Card } from '@/types';
import { CARD_POOL } from './cards';

export interface BattleResult {
  playerCards: Card[];
  opponentCards: Card[];
  winner: 'player' | 'opponent';
  playerTotalPower: number;
  opponentTotalPower: number;
  powerDiff: number;
  playerCardsWithPower: Array<Card & { power: number }>;
  opponentCardsWithPower: Array<Card & { power: number }>;
}

/**
 * Get 3 random opponent cards
 */
export function getOpponentCards(): Card[] {
  return [
    CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)],
    CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)],
    CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)],
  ];
}

/**
 * Simple power-based battle: higher total power wins
 * Each card's power is slightly randomized (±5%)
 */
export function simulateBattle(playerCards: Card[], opponentCards: Card[]): BattleResult {
  // Calculate power for each card with variance
  const playerCardsWithPower = playerCards.map((card) => ({
    ...card,
    power: Math.round(card.power * (0.95 + Math.random() * 0.1)),
  }));

  const opponentCardsWithPower = opponentCards.map((card) => ({
    ...card,
    power: Math.round(card.power * (0.95 + Math.random() * 0.1)),
  }));

  const playerTotalPower = playerCardsWithPower.reduce((sum, card) => sum + card.power, 0);
  const opponentTotalPower = opponentCardsWithPower.reduce((sum, card) => sum + card.power, 0);

  const winner = playerTotalPower > opponentTotalPower ? 'player' : 'opponent';

  return {
    playerCards,
    opponentCards,
    winner,
    playerTotalPower,
    opponentTotalPower,
    powerDiff: Math.abs(playerTotalPower - opponentTotalPower),
    playerCardsWithPower,
    opponentCardsWithPower,
  };
}


