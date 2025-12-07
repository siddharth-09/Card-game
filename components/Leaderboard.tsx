'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface PlayerStat {
  address: string;
  username: string;
  wins: number;
  battles: number;
  earnings: number;
  cardCount: number;
  winRate: number;
}

export function Leaderboard() {
  const { address } = useAccount();
  const [leaderboard, setLeaderboard] = useState<PlayerStat[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'global' | 'profile'>('global');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);

        // Fetch global leaderboard
        const leaderboardRes = await fetch('/api/leaderboard');
        if (leaderboardRes.ok) {
          const data = await leaderboardRes.json();
          setLeaderboard(data);
        }

        // Fetch player stats if logged in
        if (address) {
          const playerRes = await fetch(`/api/leaderboard?player=${address}`);
          if (playerRes.ok) {
            const data = await playerRes.json();
            setPlayerStats(data);
          }
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [address]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin text-blue-500 text-3xl mb-2">⚡</div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
        <button
          onClick={() => setSelectedTab('global')}
          className={`flex-1 py-2 rounded font-semibold transition-all ${
            selectedTab === 'global'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🏆 Global Leaderboard
        </button>
        {address && (
          <button
            onClick={() => setSelectedTab('profile')}
            className={`flex-1 py-2 rounded font-semibold transition-all ${
              selectedTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            👤 My Stats
          </button>
        )}
      </div>

      {/* Global Leaderboard */}
      {selectedTab === 'global' && (
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white mb-4">🏆 Top Players</h2>
          {leaderboard.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No players yet. Be the first to play!
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((player, idx) => (
                <div
                  key={player.address}
                  className={`rounded-lg p-4 border-l-4 transition-all ${
                    address?.toLowerCase() === player.address.toLowerCase()
                      ? 'bg-blue-900/50 border-blue-500'
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-yellow-400 min-w-12">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{player.username}</p>
                        <p className="text-xs text-gray-500">{player.address.slice(0, 10)}...</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 text-right text-sm">
                      <div>
                        <p className="text-gray-400">Wins</p>
                        <p className="font-bold text-green-400">{player.wins}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Battles</p>
                        <p className="font-bold text-blue-400">{player.battles}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Rate</p>
                        <p className="font-bold text-purple-400">{player.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Earnings</p>
                        <p className="font-bold text-yellow-400">{player.earnings.toFixed(2)} Ⓑ</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Cards</p>
                        <p className="font-bold text-pink-400">{player.cardCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Player Profile */}
      {selectedTab === 'profile' && playerStats && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-8 border border-blue-700 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Your Stats</h2>
            <p className="text-gray-300">{playerStats.username}</p>
            <p className="text-sm text-gray-500">{playerStats.address}</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Battles</p>
                <p className="text-3xl font-bold text-blue-400">{playerStats.battles}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Wins</p>
                <p className="text-3xl font-bold text-green-400">{playerStats.wins}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                <p className="text-3xl font-bold text-purple-400">{playerStats.winRate}%</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Earnings</p>
                <p className="text-3xl font-bold text-yellow-400">{playerStats.earnings.toFixed(2)} Ⓑ</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">NFT Cards</p>
                <p className="text-3xl font-bold text-pink-400">{playerStats.cardCount}</p>
              </div>
            </div>
          </div>

          {/* Rank Info */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Ranking</h3>
            {(() => {
              const rank = leaderboard.findIndex(
                (p) => p.address.toLowerCase() === playerStats.address.toLowerCase()
              );
              return (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-2">You are ranked</p>
                  <p className="text-4xl font-bold text-yellow-400">#{rank !== -1 ? rank + 1 : 'N/A'}</p>
                  <p className="text-gray-400 mt-2">out of {leaderboard.length} players</p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {!address && selectedTab === 'profile' && (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400">Connect your wallet to view your stats</p>
        </div>
      )}
    </div>
  );
}

