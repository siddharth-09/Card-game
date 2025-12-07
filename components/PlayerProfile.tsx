'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface PlayerStats {
  address: string;
  username: string;
  wins: number;
  battles: number;
  earnings: number;
  cardCount: number;
  winRate: number;
}

export function PlayerProfile() {
  const { address: walletAddress } = useAccount();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }

    const fetchPlayerData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/leaderboard?player=${walletAddress}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setStats(null);
        }
      } catch (err) {
        console.error('Error fetching player data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();
    const interval = setInterval(fetchPlayerData, 10000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  if (!walletAddress) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Connect your wallet to view your profile</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Loading profile...</p>
          <div className="animate-spin text-blue-500 text-3xl">⚡</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">No profile data yet. Start playing to see your stats!</p>
      </div>
    );
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="w-full space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Profile</h2>
            <p className="text-gray-300 font-mono">{formatAddress(walletAddress)}</p>
            <p className="text-gray-400 text-sm mt-2">{stats.username}</p>
          </div>
          <div className="text-5xl">👤</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Battles */}
        <div className="bg-gray-800 rounded-lg p-4 border border-blue-700">
          <p className="text-gray-400 text-sm mb-2">Battles Played</p>
          <p className="text-3xl font-bold text-blue-400">{stats.battles}</p>
          <p className="text-xs text-gray-500 mt-2">Total Matches</p>
        </div>

        {/* Wins */}
        <div className="bg-gray-800 rounded-lg p-4 border border-green-700">
          <p className="text-gray-400 text-sm mb-2">Total Wins</p>
          <p className="text-3xl font-bold text-green-400">{stats.wins}</p>
          <p className="text-xs text-gray-500 mt-2">Victories</p>
        </div>

        {/* Win Rate */}
        <div className="bg-gray-800 rounded-lg p-4 border border-yellow-700">
          <p className="text-gray-400 text-sm mb-2">Win Rate</p>
          <p className="text-3xl font-bold text-yellow-400">{stats.winRate}%</p>
          <p className="text-xs text-gray-500 mt-2">Success Rate</p>
        </div>

        {/* Cards Owned */}
        <div className="bg-gray-800 rounded-lg p-4 border border-pink-700">
          <p className="text-gray-400 text-sm mb-2">Cards Owned</p>
          <p className="text-3xl font-bold text-pink-400">{stats.cardCount}</p>
          <p className="text-xs text-gray-500 mt-2">NFTs Minted</p>
        </div>
      </div>

      {/* Earnings */}
      <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-6 border border-green-700">
        <p className="text-gray-300 text-sm mb-2">Total Earnings</p>
        <p className="text-4xl font-bold text-green-300 mb-2">{stats.earnings.toFixed(4)} Ⓑ</p>
        <p className="text-xs text-gray-400">Accumulated from battle rewards</p>
      </div>

      {/* Base Sepolia Info */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
        <p className="text-blue-200 text-sm">
          🔗 <strong>Network:</strong> Base Sepolia Testnet
        </p>
        <p className="text-blue-200 text-sm mt-2">
          💰 <strong>Wallet:</strong> {formatAddress(walletAddress)}
        </p>
      </div>
    </div>
  );
}
