import { Card, CardRarity } from '@/types';

// Rarity probabilities (when user stakes, we use these weights)
export const RARITY_WEIGHTS = {
  common: 50,    // 50% chance (3 common cards)
  rare: 35,      // 35% chance (3 rare cards)
  legendary: 15, // 15% chance (2 legendary cards)
};

// 8 Base cards with hybrid approach (3 common, 3 rare, 2 legendary)
export const CARD_POOL: Card[] = [
  // COMMON CARDS (3)
  {
    id: 1,
    name: 'Anya, the Arcane Whisper',
    rarity: 'common',
    power: 65,
    traits: ['arcane', 'magic', 'control'],
    imageUrl: '/images/cards/image.png',
    description: 'Master of ancient arcane arts. Controls the flow of magic itself.',
  },
  {
    id: 2,
    name: 'Kaelen Warrior',
    rarity: 'common',
    power: 70,
    traits: ['warrior', 'earth', 'offensive'],
    imageUrl: '/images/cards/image1.png',
    description: 'Mighty earth warrior. Strikes with the force of nature.',
  },
  {
    id: 3,
    name: 'Zephyr Fury',
    rarity: 'common',
    power: 68,
    traits: ['lightning', 'speed', 'aggressive'],
    imageUrl: '/images/cards/image2.png',
    description: 'Swift and electrifying. Darts across the battlefield.',
  },

  // RARE CARDS (3)
  {
    id: 4,
    name: 'Drakon Guardian',
    rarity: 'rare',
    power: 85,
    traits: ['dragon', 'dark', 'tank'],
    imageUrl: '/images/cards/image3.png',
    description: 'Ancient dragon guardian. Impenetrable defense and dark power.',
  },
  {
    id: 5,
    name: 'Sermaa Fina',
    rarity: 'rare',
    power: 80,
    traits: ['light', 'holy', 'support'],
    imageUrl: '/images/cards/image4.png',
    description: 'Divine healer of light. Radiates protective holy energy.',
  },
  {
    id: 6,
    name: 'Ignis Shamar',
    rarity: 'rare',
    power: 88,
    traits: ['fire', 'inferno', 'burst'],
    imageUrl: '/images/cards/image5.png',
    description: 'Master of flames and inferno. Unstoppable burning force.',
  },

  // LEGENDARY CARDS (2)
  {
    id: 7,
    name: 'Stra Caller',
    rarity: 'legendary',
    power: 92,
    traits: ['cosmic', 'magic', 'control'],
    imageUrl: '/images/cards/image6.png',
    description: 'Calls upon cosmic forces. Commands the stars themselves.',
  },
  {
    id: 8,
    name: 'Thorne',
    rarity: 'legendary',
    power: 95,
    traits: ['shadow', 'poison', 'stealth'],
    imageUrl: '/images/cards/image.png',
    description: 'The shadow that lingers. Toxic and mysterious.',
  },
];

/**
 * Get random card based on rarity weights
 */
export function getRandomCard(): Card {
  const rand = Math.random() * 100;
  let rarity: CardRarity;

  if (rand < RARITY_WEIGHTS.common) {
    rarity = 'common';
  } else if (rand < RARITY_WEIGHTS.common + RARITY_WEIGHTS.rare) {
    rarity = 'rare';
  } else {
    rarity = 'legendary';
  }

  const cardsOfRarity = CARD_POOL.filter((card) => card.rarity === rarity);
  const baseCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
  
  // Add variance to power (±8%) so each card instance feels unique
  const variance = (Math.random() - 0.5) * 0.16; // ±8%
  const variedPower = Math.round(baseCard.power * (1 + variance));
  
  return {
    ...baseCard,
    power: variedPower,
  };
}

/**
 * Get rarity color for UI
 */
export function getRarityColor(rarity: CardRarity): string {
  switch (rarity) {
    case 'common':
      return '#A3B3C2'; // gray
    case 'rare':
      return '#3B82F6'; // blue
    case 'legendary':
      return '#F59E0B'; // gold
    default:
      return '#A3B3C2';
  }
}

/**
 * Get rarity badge
 */
export function getRarityBadge(rarity: CardRarity): string {
  switch (rarity) {
    case 'common':
      return '●';
    case 'rare':
      return '●●';
    case 'legendary':
      return '●●●';
    default:
      return '';
  }
}
