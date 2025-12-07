/**
 * Contract addresses and configuration for Base Sepolia testnet
 * Deploy instructions:
 * 1. Install Foundry: curl -L https://foundry.paradigm.xyz | bash
 * 2. Create .env file with PRIVATE_KEY and BASE_SEPOLIA_RPC_URL
 * 3. Run: forge create contracts/CardGame.sol:CardGameNFT --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --verify --verifier-url https://api-sepolia.basescan.org/api --etherscan-api-key $BASE_ETHERSCAN_KEY
 */

// Base Sepolia Configuration
export const BASE_SEPOLIA_CONFIG = {
  chainId: 84532,
  chainName: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
};

// Contract addresses (replace with your deployed contract address)
export const CONTRACT_ADDRESSES = {
  CardGameNFT: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
};

// Contract ABI (simplified)
export const CARD_GAME_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'rarity', type: 'string' },
      { internalType: 'uint256', name: 'power', type: 'uint256' },
      { internalType: 'uint256[]', name: 'traits', type: 'uint256[]' },
      { internalType: 'string', name: 'imageUri', type: 'string' },
    ],
    name: 'mintCard',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'winner', type: 'address' },
      { internalType: 'address', name: 'loser', type: 'address' },
      { internalType: 'uint256', name: 'stake', type: 'uint256' },
    ],
    name: 'recordBattle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'player', type: 'address' }],
    name: 'getPlayerCards',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'player', type: 'address' }],
    name: 'getPlayerStats',
    outputs: [
      { internalType: 'address', name: 'player', type: 'address' },
      { internalType: 'uint256', name: 'wins', type: 'uint256' },
      { internalType: 'uint256', name: 'losses', type: 'uint256' },
      { internalType: 'uint256', name: 'totalEarnings', type: 'uint256' },
      { internalType: 'uint256', name: 'cardsOwned', type: 'uint256' },
      { internalType: 'uint256', name: 'lastBattleAt', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLeaderboard',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'player', type: 'address' },
          { internalType: 'uint256', name: 'wins', type: 'uint256' },
          { internalType: 'uint256', name: 'losses', type: 'uint256' },
          { internalType: 'uint256', name: 'totalEarnings', type: 'uint256' },
          { internalType: 'uint256', name: 'cardsOwned', type: 'uint256' },
          { internalType: 'uint256', name: 'lastBattleAt', type: 'uint256' },
        ],
        internalType: 'struct CardGameNFT.PlayerStats[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
