/**
 * Contract interactions and wallet integration
 */

import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, CARD_GAME_ABI, BASE_SEPOLIA_CONFIG } from './contract-config';

/**
 * Hook to mint a card NFT
 */
export function useMintCard() {
  const { address: walletAddress } = useAccount();

  const mintCardTx = async (
    name: string,
    rarity: string,
    power: number,
    traits: number[],
    imageUri: string,
    stakeAmount: number
  ) => {
    try {
      // Validate inputs
      if (!walletAddress) throw new Error('Wallet not connected');
      if (!CONTRACT_ADDRESSES.CardGameNFT || CONTRACT_ADDRESSES.CardGameNFT === '0x0000000000000000000000000000000000000000') {
        throw new Error('Contract not deployed. Please set NEXT_PUBLIC_CONTRACT_ADDRESS');
      }

      // Call contract via JSON-RPC
      const response = await fetch('/api/contract/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          rarity,
          power,
          traits,
          imageUri,
          walletAddress,
          stakeAmount,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Mint failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Mint card error:', error);
      throw error;
    }
  };

  return { mintCard: mintCardTx, isLoading: false };
}

/**
 * Get player's cards from blockchain
 */
export async function getPlayerCards(address: string) {
  try {
    const response = await fetch('/api/contract/player-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) throw new Error('Failed to fetch player cards');
    return await response.json();
  } catch (error) {
    console.error('Get player cards error:', error);
    throw error;
  }
}

/**
 * Get player stats from blockchain
 */
export async function getPlayerStats(address: string) {
  try {
    const response = await fetch('/api/contract/player-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) throw new Error('Failed to fetch player stats');
    return await response.json();
  } catch (error) {
    console.error('Get player stats error:', error);
    throw error;
  }
}

/**
 * Get global leaderboard
 */
export async function getLeaderboard() {
  try {
    const response = await fetch('/api/contract/leaderboard', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return await response.json();
  } catch (error) {
    console.error('Get leaderboard error:', error);
    throw error;
  }
}

/**
 * Record battle result on blockchain
 */
export async function recordBattle(winner: string, loser: string, stake: number) {
  try {
    const response = await fetch('/api/contract/record-battle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        winner,
        loser,
        stake,
      }),
    });

    if (!response.ok) throw new Error('Failed to record battle');
    return await response.json();
  } catch (error) {
    console.error('Record battle error:', error);
    throw error;
  }
}
