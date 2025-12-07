import { Card } from '@/types';

export interface CardRound {
  playerCard: Card | null;
  opponentCard: Card | null;
  winner: 'player' | 'opponent' | null;
  timestamp: number;
}

export interface BattleState {
  playerCards: Card[];
  opponentCards: Card[];
  playerDefeatedCount: number;
  opponentDefeatedCount: number;
  currentRound: number;
  rounds: CardRound[];
  battleStatus: 'waiting-for-cards' | 'cards-selected' | 'revealed' | 'completed';
  winner: 'player' | 'opponent' | null;
  message: string;
}

/**
 * Play a single card against opponent's card
 * Returns the winner of this round
 */
export function playCardRound(
  playerCard: Card,
  opponentCard: Card
): 'player' | 'opponent' {
  // Add ±3% variance for fairness
  const playerPowerVariance = playerCard.power * (0.97 + Math.random() * 0.06);
  const opponentPowerVariance = opponentCard.power * (0.97 + Math.random() * 0.06);

  return playerPowerVariance > opponentPowerVariance ? 'player' : 'opponent';
}

/**
 * Initialize a new battle
 */
export function initializeBattle(playerCards: Card[], opponentCards: Card[]): BattleState {
  if (playerCards.length !== 3 || opponentCards.length !== 3) {
    throw new Error('Each player must have exactly 3 cards');
  }

  return {
    playerCards: [...playerCards],
    opponentCards: [...opponentCards],
    playerDefeatedCount: 0,
    opponentDefeatedCount: 0,
    currentRound: 0,
    rounds: [],
    battleStatus: 'waiting-for-cards',
    winner: null,
    message: 'Select your first card to attack!',
  };
}

/**
 * Process a round of battle
 */
export function processRound(
  state: BattleState,
  playerCardIndex: number,
  opponentCardIndex: number
): BattleState {
  if (playerCardIndex < 0 || playerCardIndex >= state.playerCards.length) {
    throw new Error('Invalid player card index');
  }
  if (opponentCardIndex < 0 || opponentCardIndex >= state.opponentCards.length) {
    throw new Error('Invalid opponent card index');
  }

  const playerCard = state.playerCards[playerCardIndex];
  const opponentCard = state.opponentCards[opponentCardIndex];

  const roundWinner = playCardRound(playerCard, opponentCard);

  const newState = { ...state };

  if (roundWinner === 'player') {
    newState.opponentDefeatedCount += 1;
    newState.message = `You won! ${opponentCard.name} defeated!`;
  } else {
    newState.playerDefeatedCount += 1;
    newState.message = `You lost! ${playerCard.name} defeated!`;
  }

  newState.rounds.push({
    playerCard,
    opponentCard,
    winner: roundWinner,
    timestamp: Date.now(),
  });

  newState.currentRound += 1;

  // Check if battle is over
  if (newState.playerDefeatedCount === 3) {
    newState.winner = 'opponent';
    newState.battleStatus = 'completed';
    newState.message = '😢 All your cards defeated! You lost the battle.';
  } else if (newState.opponentDefeatedCount === 3) {
    newState.winner = 'player';
    newState.battleStatus = 'completed';
    newState.message = '🏆 All opponent cards defeated! You won!';
  } else {
    newState.battleStatus = 'waiting-for-cards';
    newState.message = 'Select your next card to attack!';
  }

  return newState;
}

/**
 * Get remaining cards for a player
 */
export function getRemainingCards(cards: Card[], defeatedCount: number): Card[] {
  return cards.slice(defeatedCount);
}
