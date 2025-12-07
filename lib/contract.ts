import { Contract, ethers } from 'ethers';

// Card NFT Contract ABI
export const CARD_NFT_ABI = [
  'function mint(address to, uint256 cardId, bytes32 seed) public payable returns (uint256)',
  'function balanceOf(address owner) public view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)',
  'function tokenURI(uint256 tokenId) public view returns (string)',
  'event CardMinted(address indexed player, uint256 indexed tokenId, uint256 cardId)',
];

// Game Contract ABI
export const GAME_ABI = [
  'function createBattle(address opponent, uint256[] playerCards, uint256[] opponentCards) public payable',
  'function resolveBattle(uint256 battleId, uint256[] winnerCards, uint256[] loserCards) public',
  'function claimRewards(uint256 battleId) public',
  'function getPlayerStats(address player) public view returns (tuple(uint256 battles, uint256 wins, uint256 earnings, uint256 cardCount))',
  'event BattleCreated(uint256 indexed battleId, address indexed player1, address indexed player2, uint256 stake)',
  'event BattleResolved(uint256 indexed battleId, address indexed winner, uint256 amount)',
];

export const CARD_NFT_ADDRESS = process.env.NEXT_PUBLIC_CARD_NFT_CONTRACT || '';
export const GAME_ADDRESS = process.env.NEXT_PUBLIC_GAME_CONTRACT || '';

export const BASE_SEPOLIA_CONFIG = {
  chainId: 84532,
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
};

export async function getContractInstance(
  contractAddress: string,
  abi: string[],
  signer?: any
) {
  try {
    if (!signer) {
      // Read-only provider
      const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_CONFIG.rpcUrl);
      return new Contract(contractAddress, abi, provider);
    }
    return new Contract(contractAddress, abi, signer);
  } catch (error) {
    console.error('Error getting contract instance:', error);
    throw error;
  }
}

export async function mintCard(
  signer: any,
  cardId: number,
  seed: string
) {
  try {
    const contract = new Contract(CARD_NFT_ADDRESS, CARD_NFT_ABI, signer);
    const price = ethers.parseEther(process.env.NEXT_PUBLIC_MINT_PRICE || '0.01');
    
    const tx = await contract.mint(await signer.getAddress(), cardId, seed, {
      value: price,
    });

    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error('Error minting card:', error);
    throw error;
  }
}

export async function getPlayerStats(playerAddress: string) {
  try {
    const contract = new Contract(GAME_ADDRESS, GAME_ABI);
    const stats = await contract.getPlayerStats(playerAddress);
    return {
      battles: Number(stats[0]),
      wins: Number(stats[1]),
      earnings: ethers.formatEther(stats[2]),
      cardCount: Number(stats[3]),
    };
  } catch (error) {
    console.error('Error getting player stats:', error);
    return {
      battles: 0,
      wins: 0,
      earnings: '0',
      cardCount: 0,
    };
  }
}
