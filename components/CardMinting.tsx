'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { Card } from '@/types';
import { getRandomCard } from '@/lib/cards';
import { CardReveal } from './CardReveal';
import { parseEther } from 'viem';

interface CardMintingProps {
  onCardsMinted?: (cards: Card[], stakeAmount: number) => void;
}

// CardGameNFT Contract ABI - Full ABI for type safety
const CONTRACT_ABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'rarity', type: 'string' },
      { name: 'power', type: 'uint256' },
      { name: 'traits', type: 'uint256[]' },
      { name: 'imageUri', type: 'string' },
    ],
    name: 'mintCard',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3') as `0x${string}`;
const EXPECTED_CHAIN_ID = 8453; // Base Sepolia Testnet

export function CardMinting({ onCardsMinted }: CardMintingProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [stakeAmount, setStakeAmount] = useState('0.01');
  const [isLoading, setIsLoading] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash as `0x${string}` | undefined });

  // Watch for successful transaction
  useEffect(() => {
    if (isSuccess && revealedCards.length > 0) {
      setIsLoading(false);
    }
  }, [isSuccess, revealedCards.length]);

  const handleMint = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    // Check if on correct chain
    if (chainId !== EXPECTED_CHAIN_ID) {
      setError(
        `Wrong network! You're on chain ${chainId}. Please switch to Base Sepolia (chain ${EXPECTED_CHAIN_ID}).`
      );
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setError('Please enter a valid stake amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate 3 random cards
      const cards = [getRandomCard(), getRandomCard(), getRandomCard()];
      const mintPrice = parseEther(stakeAmount); // Use dynamic stake amount

      console.log('🚀 Starting mint transaction...');
      console.log('📝 Contract Address:', CONTRACT_ADDRESS);
      console.log('👤 User Address:', address);
      console.log('🔗 Chain ID:', chainId);
      console.log('💰 Mint Price:', mintPrice.toString());
      console.log('🎴 Card Data:', {
        name: cards[0].name,
        rarity: cards[0].rarity,
        power: cards[0].power,
      });
      
      // Mint first card
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintCard',
        args: [
          cards[0].name,
          cards[0].rarity,
          BigInt(cards[0].power),
          [],
          '',
        ],
        value: mintPrice,
      });

      setTxHash(hash);
      console.log('✅ Transaction sent! Hash:', hash);

      // Show revealed cards
      setRevealedCards(cards);

      // Update stats
      if (onCardsMinted) {
        onCardsMinted(cards, parseFloat(stakeAmount));
      }

      // Reset form
      setStakeAmount('0.01');
    } catch (err: any) {
      console.error('🔴 Minting error details:', {
        message: err?.message,
        code: err?.code,
        cause: err?.cause,
        details: err?.details,
        shortMessage: err?.shortMessage,
        stack: err?.stack,
      });
      
      let errorMessage = 'Failed to mint cards. ';
      if (err?.message?.includes('insufficient') || err?.message?.includes('balance')) {
        errorMessage += `Insufficient balance. You need ETH for gas + ${stakeAmount} ETH mint cost.`;
      } else if (err?.message?.includes('user rejected') || err?.code === 'ACTION_REJECTED') {
        errorMessage += 'Transaction rejected by user.';
      } else if (err?.code === 'INSUFFICIENT_FUNDS') {
        errorMessage += 'Not enough funds for gas + contract call.';
      } else if (err?.message?.includes('network')) {
        errorMessage += 'Network error. Ensure you are on Base Sepolia.';
      } else if (err?.message?.includes('Contract') || err?.message?.includes('address')) {
        errorMessage += 'Contract error. Ensure contract is deployed at the address.';
      } else {
        errorMessage += err?.message || 'Please check console for details.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Minting Form */}
      {revealedCards.length === 0 && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">⚔️ Mint 3 Battle Cards</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded bg-red-900/30 border border-red-700">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Wallet & Network Status */}
          <div className="mb-6 p-4 rounded bg-gray-700/30 border border-gray-600 space-y-3">
            {isConnected ? (
              <>
                <div>
                  <p className="text-green-400 text-sm font-semibold">✓ Wallet Connected</p>
                  <p className="text-gray-300 text-xs mt-1">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                
                {/* Network Status */}
                {chainId === EXPECTED_CHAIN_ID ? (
                  <div className="p-2 rounded bg-green-900/20 border border-green-700/30">
                    <p className="text-green-400 text-xs font-semibold">✓ Connected to Base Sepolia</p>
                    <p className="text-green-300 text-xs mt-1">Ready to mint NFTs!</p>
                  </div>
                ) : (
                  <div className="p-3 rounded bg-red-900/20 border border-red-700/30 space-y-2">
                    <p className="text-red-400 text-sm font-semibold">⚠️ Wrong Network Detected</p>
                    <p className="text-red-300 text-xs">
                      You're on chain <span className="font-mono font-bold">{chainId}</span>, but need <span className="font-mono font-bold">{EXPECTED_CHAIN_ID}</span>
                    </p>
                    <p className="text-red-300 text-xs mt-2">👉 <strong>Please switch to Base Sepolia testnet</strong></p>
                    <div className="mt-3 pt-3 border-t border-red-700/30 space-y-2">
                      <p className="text-red-300 text-xs font-semibold">How to switch:</p>
                      <ol className="text-red-300 text-xs space-y-1 list-decimal list-inside">
                        <li>Open MetaMask / your wallet</li>
                        <li>Click network selector (top-left)</li>
                        <li>Enable "Show test networks"</li>
                        <li>Select "Base Sepolia"</li>
                      </ol>
                    </div>
                  </div>
                )}
                
                {/* Testnet ETH Info */}
                {chainId === EXPECTED_CHAIN_ID && (
                  <div className="p-2 rounded bg-blue-900/20 border border-blue-700/30">
                    <p className="text-blue-400 text-xs font-semibold">💡 Need testnet ETH?</p>
                    <p className="text-blue-300 text-xs mt-1">
                      Get free ETH from{' '}
                      <a
                        href="https://www.basescan.io/faucet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-200"
                      >
                        Base Faucet
                      </a>
                      {' '}(need ~{(parseFloat(stakeAmount) + 0.01).toFixed(2)} ETH for gas + minting)
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-400 text-sm font-semibold">✗ Wallet Not Connected</p>
            )}
          </div>

          {/* Stake Amount Input */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Stake Amount (ETH)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 disabled:opacity-50"
                placeholder="0.01"
              />
              <span className="flex items-center px-3 py-2 bg-gray-700 rounded border border-gray-600 text-gray-300 text-sm font-semibold">
                ETH
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              This ETH will be staked when you battle your cards
            </p>
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 rounded bg-blue-900/20 border border-blue-700/30">
            <p className="text-blue-300 text-sm">
              ℹ️ You'll receive 3 random cards. Use them to battle and earn rewards!
            </p>
          </div>

          {/* Mint Button */}
          <button
            onClick={handleMint}
            disabled={!isConnected || isLoading}
            className={`w-full py-3 rounded font-bold text-white transition-all ${
              isConnected && !isLoading
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer'
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚡</span>
                Minting...
              </span>
            ) : (
              '🎴 Mint 3 Cards'
            )}
          </button>
        </div>
      )}

      {/* Cards Reveal */}
      {revealedCards.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">🎉 You Got 3 Cards!</h2>
            <p className="text-gray-400">Ready to battle? Go to Collection tab</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {revealedCards.map((card, idx) => (
              <CardReveal key={idx} card={card} />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRevealedCards([])}
              className="py-2 rounded font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all"
            >
              Mint More
            </button>
            <button
              disabled
              className="py-2 rounded font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
            >
              View Collection →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
