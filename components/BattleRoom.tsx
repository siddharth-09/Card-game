'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/types';
import { getRoomAPI, markPlayerReadyAPI, leaveRoomAPI, playCardAPI } from '@/lib/rooms-api';
import { CardReveal } from './CardReveal';

interface BattleRoomProps {
  roomId: string;
  playerAddress: string;
  selectedCards: Card[];
  stakeAmount: number;
  onBattleEnd?: () => void;
  onBack?: () => void;
}

interface RoomPlayer {
  address: string;
  selectedCards: Card[];
  stakeAmount: number;
  totalPower: number;
  isReady: boolean;
  userName?: string;
}

interface CardRound {
  playerCard: Card;
  opponentCard: Card;
  winner: string;
  timestamp: number;
}

interface BattleState {
  currentRound: number;
  playerDefeatedCount: number;
  opponentDefeatedCount: number;
  rounds: CardRound[];
  battleStatus: 'waiting-for-cards' | 'cards-selected' | 'revealed' | 'completed';
  winner: string | null;
  message: string;
  pendingCards?: {
    [playerAddress: string]: number;
  };
}

interface BattleRoomData {
  id: string;
  name: string;
  stakeAmount: number;
  maxPlayers: number;
  currentPlayers: number;
  players: RoomPlayer[];
  status: 'waiting' | 'ready' | 'battling' | 'completed';
  createdAt: number;
  createdBy: string;
  battleState?: BattleState;
  battleResult?: {
    winner: string;
    loser: string;
  };
}

export function BattleRoom({ roomId, playerAddress, selectedCards, stakeAmount, onBack }: BattleRoomProps) {
  const [room, setRoom] = useState<BattleRoomData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defeatedIndices, setDefeatedIndices] = useState<Set<number>>(new Set());

  // Fetch room updates
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        console.log('[BattleRoom] Fetching room:', roomId);
        const updatedRoom = await getRoomAPI(roomId);
        setRoom(updatedRoom);
        setIsLoading(false);
      } catch (err) {
        console.log('[BattleRoom] Error fetching room:', err);
        setError('Failed to load room');
        setIsLoading(false);
      }
    };

    fetchRoom();

    // Poll for updates every 1 second
    const interval = setInterval(fetchRoom, 1000);
    return () => clearInterval(interval);
  }, [roomId]);

  const handleReadyUp = async () => {
    try {
      setIsLoading(true);
      const updatedRoom = await markPlayerReadyAPI(roomId, playerAddress);
      setRoom(updatedRoom);
      setIsReady(true);
    } catch (err) {
      setError('Failed to mark ready');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayCard = async () => {
    if (selectedCardIndex === null || !opponent) return;
    
    try {
      setIsLoading(true);
      const updatedRoom = await playCardAPI(roomId, playerAddress, selectedCardIndex);
      setRoom(updatedRoom);
      setSelectedCardIndex(null);
    } catch (err) {
      setError('Failed to play card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoomAPI(roomId, playerAddress);
      if (onBack) {
        onBack();
      }
    } catch (err) {
      setError('Failed to leave room');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Loading room...</p>
          <div className="animate-spin text-blue-500 text-3xl">⚡</div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error || 'Room not found'}</p>
        <button
          onClick={handleLeaveRoom}
          className="px-6 py-2 rounded font-semibold bg-gray-700 text-white hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const opponent = room.players.find((p: RoomPlayer) => p.address !== playerAddress);
  const playerTotalPower = selectedCards.reduce((sum, card) => sum + card.power, 0);

  // Get remaining undefeated cards
  const getUndefeatedCards = (cards: Card[], defeatedCount: number) => {
    return cards.slice(0, 3 - defeatedCount);
  };

  const playerUndefeatedCards = getUndefeatedCards(selectedCards, room.battleState?.playerDefeatedCount || 0);
  const opponentUndefeatedCards = opponent
    ? getUndefeatedCards(opponent.selectedCards, room.battleState?.opponentDefeatedCount || 0)
    : [];

  return (
    <div className="w-full space-y-6">
      {/* Room Info */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-700">
        <h2 className="text-2xl font-bold text-white mb-2">{room.name}</h2>
        <div className="flex gap-4 text-gray-200">
          <span>🎯 Stake: {room.stakeAmount} ETH</span>
          <span>👥 Players: {room.currentPlayers}/{room.maxPlayers}</span>
          <span>⚡ Status: {room.status}</span>
        </div>
      </div>

      {/* Waiting for Opponent */}
      {room.status === 'waiting' && !opponent && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <p className="text-gray-300 mb-6">Waiting for opponent to join...</p>
          <div className="animate-pulse text-3xl mb-6">🔍</div>
          <button
            onClick={handleLeaveRoom}
            className="px-6 py-2 rounded font-semibold bg-gray-700 text-white hover:bg-gray-600"
          >
            Leave Room
          </button>
        </div>
      )}

      {/* Pre-Battle: Both players ready up */}
      {room.status === 'waiting' && opponent && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your Cards */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Your Cards (Hidden from Opponent)</h3>
              <div className="space-y-3">
                {selectedCards.map((card, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-lg p-3 border border-blue-600">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">{card.name}</span>
                      <span className="text-blue-300">⚡ {card.power}</span>
                    </div>
                  </div>
                ))}
                <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-600 font-bold text-blue-300">
                  Total Power: {playerTotalPower}
                </div>
              </div>
            </div>

            {/* Opponent Cards Hidden */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Opponent Cards</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((_, idx) => (
                  <div key={idx} className="bg-gray-700 rounded-lg p-3 border border-gray-600 opacity-60">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-400">? ? ?</span>
                      <span className="text-gray-400">⚡ ?</span>
                    </div>
                  </div>
                ))}
                <div className="bg-gray-900 rounded-lg p-3 border border-gray-600 font-bold text-gray-400">
                  Cards Hidden
                </div>
              </div>
            </div>
          </div>

          {/* Ready Button */}
          <button
            onClick={handleReadyUp}
            disabled={isReady || isLoading}
            className={`w-full py-3 rounded font-bold text-white transition-all ${
              isReady
                ? 'bg-green-600 cursor-default'
                : isLoading
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {isReady ? '✓ Ready!' : isLoading ? 'Marking Ready...' : '🎮 Ready to Battle'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            {room.players.filter((p: RoomPlayer) => p.isReady).length}/{room.players.length} players ready
          </p>
        </div>
      )}

      {/* Battling: Sequential Card Selection */}
      {room.status === 'battling' && room.battleState && (
        <div className="space-y-6">
          {/* Battle Progress */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white">Round {room.battleState.currentRound + 1} / 3</h3>
              <p className="text-gray-400 mt-2">{room.battleState.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Your Cards Remaining</p>
                <p className="text-3xl font-bold text-blue-400">{playerUndefeatedCards.length}/3</p>
                <p className="text-xs text-gray-500 mt-1">({room.battleState.playerDefeatedCount} defeated)</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Opponent Cards Remaining</p>
                <p className="text-3xl font-bold text-red-400">{opponentUndefeatedCards.length}/3</p>
                <p className="text-xs text-gray-500 mt-1">({room.battleState.opponentDefeatedCount} defeated)</p>
              </div>
            </div>
          </div>

          {/* Card Selection - Your Cards Only */}
          <div className="bg-gray-800 rounded-lg p-6 border border-blue-600">
            <h3 className="text-lg font-bold text-white mb-4">Select Your Card to Fight</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedCards.map((card, idx) => {
                const isDefeated = idx < room.battleState!.playerDefeatedCount;
                return (
                  <button
                    key={idx}
                    onClick={() => !isDefeated && setSelectedCardIndex(idx)}
                    disabled={isDefeated || isLoading}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isDefeated
                        ? 'bg-gray-700 border-gray-600 opacity-30 cursor-not-allowed'
                        : selectedCardIndex === idx
                          ? 'bg-blue-700 border-blue-400 shadow-lg shadow-blue-500 ring-2 ring-blue-500'
                          : 'bg-gray-700 border-blue-500 hover:border-blue-300 hover:bg-gray-600 cursor-pointer'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-bold text-white">{card.name}</p>
                      <p className="text-sm text-gray-300">⚡ Power: {Math.round(card.power)}</p>
                      {isDefeated && <p className="text-xs text-red-400 mt-1">❌ Defeated</p>}
                      {selectedCardIndex === idx && <p className="text-xs text-green-400 mt-1">✓ Selected</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlayCard}
            disabled={selectedCardIndex === null || isLoading}
            className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all ${
              selectedCardIndex === null || isLoading
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'
            }`}
          >
            {isLoading ? '⏳ Waiting for opponent...' : `⚔️ Fight with ${selectedCards[selectedCardIndex!]?.name || 'Card'}`}
          </button>

          {/* Battle History */}
          {room.battleState.rounds.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">🏆 Battle Results</h3>
              <div className="space-y-3">
                {room.battleState.rounds.map((round, idx) => (
                  <div key={idx} className="bg-gray-900 rounded-lg p-4 border-l-4 border-yellow-500">
                    <p className="text-gray-400 text-sm mb-2">Round {idx + 1}</p>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <div className="text-center">
                        <p className="font-semibold text-blue-300">{round.playerCard?.name}</p>
                        <p className="text-sm text-gray-400">⚡ {Math.round(round.playerCard?.power || 0)}</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xl font-bold ${round.winner === playerAddress ? 'text-green-400' : 'text-red-400'}`}>
                          {round.winner === playerAddress ? '✓ WON' : '✗ LOST'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-red-300">{round.opponentCard?.name}</p>
                        <p className="text-sm text-gray-400">⚡ {Math.round(round.opponentCard?.power || 0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Battle Complete: Show Results */}
      {room.status === 'completed' && room.battleState && (
        <div className="text-center py-12 space-y-6">
          <h2 className="text-4xl font-bold mb-4">
            {room.battleState.winner === playerAddress ? '🏆 You Won!' : '💔 You Lost'}
          </h2>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
            <div className="text-lg font-semibold text-gray-300 mb-4">Final Round Results</div>
            <div className="space-y-2">
              {room.battleState.rounds.map((round, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm bg-gray-900 p-3 rounded">
                  <span className="text-gray-400">Round {idx + 1}:</span>
                  <div className="flex-1 flex items-center justify-between px-4">
                    <span className="text-blue-300 font-semibold">{round.playerCard?.name} ({round.playerCard?.power})</span>
                    <span className="text-gray-400">⚔️</span>
                    <span className="text-red-300 font-semibold">({round.opponentCard?.power}) {round.opponentCard?.name}</span>
                  </div>
                  <span className={`font-bold ${round.winner === playerAddress ? 'text-green-400' : 'text-red-400'}`}>
                    {round.winner === playerAddress ? '✓ Won' : '✗ Lost'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-700">
              {room.battleState.winner === playerAddress ? (
                <p className="text-green-400 font-bold text-lg">+{(room.stakeAmount * 2).toFixed(2)} ETH Won!</p>
              ) : (
                <p className="text-red-400 font-bold text-lg">-{room.stakeAmount} ETH Lost</p>
              )}
            </div>
          </div>

          <button
            onClick={handleLeaveRoom}
            className="px-8 py-3 rounded font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Back to Rooms
          </button>
        </div>
      )}
    </div>
  );
}
