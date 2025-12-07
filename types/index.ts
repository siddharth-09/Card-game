export interface SafeAreaInsets {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export type CardRarity = 'common' | 'rare' | 'legendary';

export interface Card {
  id: number;
  name: string;
  rarity: CardRarity;
  power: number;
  traits: string[];
  imageUrl: string;
  description: string;
}

export interface MintedCard extends Card {
  tokenId: string;
  owner: string;
  mintedAt: number;
}
