'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/types';
import { CardMinting } from './CardMinting';
import { RoomList } from './RoomList';
import { BattleRoom } from './BattleRoom';
import { Leaderboard } from './Leaderboard';
import { PlayerProfile } from './PlayerProfile';

type GameTab = 'mint' | 'collection' | 'battle' | 'profile' | 'leaderboard' | 'rules';

export function CardGame() {
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState<GameTab>('mint');
  const [collection, setCollection] = useState<Card[]>([]);
  const [lastStakeAmount, setLastStakeAmount] = useState(0.01);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [selectedRoomCards, setSelectedRoomCards] = useState<Card[]>([]);
  const [selectedRoomStake, setSelectedRoomStake] = useState(0.01);

  const handleCardsMinted = (cards: Card[], stakeAmount: number) => {
    setCollection([...collection, ...cards]);
    setLastStakeAmount(stakeAmount);
  };

  const handleCreateRoom = (stakeAmount: number) => {
    // RoomList handles creation and passes the room ID via onRoomSelect
    // This is just a placeholder for any additional logic
  };

  const handleJoinRoom = (roomId: string, cards: Card[], stakeAmount: number) => {
    // RoomList handles joining and passes the room ID via onRoomSelect
    setCurrentRoomId(roomId);
    setSelectedRoomCards(cards);
    setSelectedRoomStake(stakeAmount);
  };

  const handleRoomBack = () => {
    setCurrentRoomId(null);
    setSelectedRoomCards([]);
    setActiveTab('battle');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white">🎴 Base Card Game</h1>
              <p className="text-gray-300 mt-2">Stake ETH • Mint NFT • Collect • Trade</p>
            </div>
            <div className="text-right">
              {isConnected && (
                <div className="bg-green-500/20 border border-green-500/50 rounded px-4 py-2">
                  <p className="text-green-300 text-sm font-semibold">✓ Connected</p>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 flex-wrap">
            {(['mint', 'collection', 'battle', 'profile', 'leaderboard', 'rules'] as GameTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab === 'mint' && '⚡ Mint'}
                {tab === 'collection' && `🎴 Collection (${collection.length})`}
                {tab === 'battle' && '⚔️ Battle'}
                {tab === 'profile' && '👤 Profile'}
                {tab === 'leaderboard' && '🏆 Leaderboard'}
                {tab === 'rules' && '📖 Rules'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Mint Tab */}
        {activeTab === 'mint' && (
          <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
              <p className="text-blue-200">
                🎮 Step 1: Mint 3 random cards with your stake
              </p>
            </div>
            <CardMinting onCardsMinted={handleCardsMinted} />
          </div>
        )}

        {/* Collection Tab */}
        {activeTab === 'collection' && (
          <div className="space-y-6">
            {collection.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-3xl mb-4">🎴</p>
                <p className="text-gray-400">You haven't minted any cards yet</p>
                <button
                  onClick={() => setActiveTab('mint')}
                  className="mt-4 px-6 py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                  Go Mint Cards
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Your Collection ({collection.length})</h2>
                  {collection.length >= 3 && (
                    <button
                      onClick={() => setActiveTab('battle')}
                      className="px-6 py-2 rounded font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      ⚔️ Go to Battle →
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collection.map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white">{card.name}</h3>
                        <span className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-200 capitalize">
                          {card.rarity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{card.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Power: {card.power}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Battle Tab */}
        {activeTab === 'battle' && (
          <div className="space-y-6">
            {collection.length < 3 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">You need at least 3 cards to battle</p>
                <button
                  onClick={() => setActiveTab('mint')}
                  className="mt-4 px-6 py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                  Mint Cards
                </button>
              </div>
            ) : !isConnected ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Please connect your wallet to battle</p>
              </div>
            ) : !currentRoomId ? (
              <RoomList
                collection={collection}
                onCreateRoom={handleCreateRoom}
                onRoomSelect={handleJoinRoom}
              />
            ) : (
              <BattleRoom
                roomId={currentRoomId}
                playerAddress={address!}
                selectedCards={selectedRoomCards}
                stakeAmount={selectedRoomStake}
                onBack={handleRoomBack}
              />
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && <PlayerProfile />}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && <Leaderboard />}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-white">How It Works</h2>

            <div className="space-y-4">
              {[
                {
                  num: 1,
                  title: 'Connect Your Wallet',
                  desc: 'Use WalletConnect to connect your Base wallet.',
                },
                {
                  num: 2,
                  title: 'Stake ETH',
                  desc: 'Choose how much ETH to stake. More stake = better odds for rare cards.',
                },
                {
                  num: 3,
                  title: 'Mint Card',
                  desc: 'Confirm the transaction. A random NFT card will be revealed.',
                },
                {
                  num: 4,
                  title: 'Collect & Trade',
                  desc: 'View your cards in the collection. Trade with other players (v2).',
                },
              ].map((item) => (
                <div key={item.num} className="flex gap-4 p-4 rounded bg-gray-800 border border-gray-700">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                    {item.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                ⚠️ <strong>Important:</strong> This is a game, not an investment. Cards are revealed
                randomly. Higher stakes don't guarantee better cards—just improve your odds.
              </p>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
              <h3 className="font-semibold text-blue-200 mb-2">Card Rarities</h3>
              <div className="space-y-2 text-sm text-blue-100">
                <p>🔵 <strong>Common (50%)</strong> - Power 65-70</p>
                <p>🔷 <strong>Rare (35%)</strong> - Power 80-88</p>
                <p>⭐ <strong>Legendary (15%)</strong> - Power 92-95</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
