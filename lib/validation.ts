import { z } from 'zod';

// Blockchain address validation
export const AddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address');

// Player validation
export const PlayerSchema = z.object({
  address: AddressSchema,
  username: z.string().min(1).max(50).optional(),
  wins: z.number().int().min(0).optional(),
  losses: z.number().int().min(0).optional(),
  earnings: z.number().min(0).optional(),
  cardCount: z.number().int().min(0).optional(),
});

// Card validation
export const CardSchema = z.object({
  tokenId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']),
  power: z.number().int().min(1).max(100),
  imageUri: z.string().url().optional(),
});

// Battle result validation
export const BattleResultSchema = z.object({
  winnerId: AddressSchema,
  loserId: AddressSchema,
  stake: z.number().min(0),
  timestamp: z.number().int().positive().optional(),
});

// Leaderboard query validation
export const LeaderboardQuerySchema = z.object({
  player: AddressSchema.optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// Room validation
export const RoomSchema = z.object({
  roomId: z.string().min(1),
  player1: AddressSchema,
  player2: AddressSchema.optional(),
  status: z.enum(['waiting', 'active', 'completed']).optional(),
  stake: z.number().min(0).optional(),
});

// Transaction validation
export const TransactionSchema = z.object({
  hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  from: AddressSchema,
  to: AddressSchema,
  value: z.string(),
  data: z.string().optional(),
});

export type Player = z.infer<typeof PlayerSchema>;
export type Card = z.infer<typeof CardSchema>;
export type BattleResult = z.infer<typeof BattleResultSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
