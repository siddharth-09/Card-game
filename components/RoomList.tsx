'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/types';
import { createRoomAPI, getRoomsAPI, joinRoomAPI } from '@/lib/rooms-api';

interface RoomListProps {
  collection: Card[];
  onRoomSelect?: (roomId: string, selectedCards: Card[], stakeAmount: number) => void;
  onCreateRoom?: (stakeAmount: number) => void;
}

interface AvailableRoom {
  id: string;
  name: string;
  stakeAmount: number;
  maxPlayers: number;
  currentPlayers: number;
}

export function RoomList({ collection, onRoomSelect, onCreateRoom }: RoomListProps) {
  const { address } = useAccount();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('0.01');
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch available rooms on mount and periodically
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await getRoomsAPI();
        setAvailableRooms(rooms);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();

    // Poll for updates every 2 seconds
    const interval = setInterval(fetchRooms, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async () => {
    if (selectedCards.length !== 3) {
      alert('Please select exactly 3 cards');
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter valid stake amount');
      return;
    }

    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    setIsCreating(true);

    try {
      const room = await createRoomAPI(address, parseFloat(stakeAmount), selectedCards);
      
      console.log('[RoomList] Created room:', room.id);
      
      if (onCreateRoom) {
        onCreateRoom(parseFloat(stakeAmount));
      }

      // Navigate to room
      if (onRoomSelect) {
        console.log('[RoomList] Navigating to room:', room.id);
        onRoomSelect(room.id, selectedCards, parseFloat(stakeAmount));
      }

      setShowCreateForm(false);
      setSelectedCards([]);
      setStakeAmount('0.01');
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (selectedCards.length !== 3) {
      alert('Please select exactly 3 cards');
      return;
    }

    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const room = await joinRoomAPI(roomId, address, parseFloat(stakeAmount), selectedCards);
      
      if (onRoomSelect) {
        onRoomSelect(roomId, selectedCards, parseFloat(stakeAmount));
      }

      setSelectedCards([]);
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const toggleCardSelection = (card: Card) => {
    if (selectedCards.find((c) => c.id === card.id && c.name === card.name)) {
      setSelectedCards(selectedCards.filter((c) => !(c.id === card.id && c.name === card.name)));
    } else {
      if (selectedCards.length < 3) {
        setSelectedCards([...selectedCards, card]);
      } else {
        alert('You can only select 3 cards');
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Available Rooms */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Available Battle Rooms</h2>

        {availableRooms.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <p className="text-gray-400">No active rooms. Create one to start battling!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRooms.map((room) => (
              <div key={room.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-white">{room.name}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-green-900 text-green-200">
                    {room.currentPlayers}/{room.maxPlayers}
                  </span>
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  <p className="text-gray-300">Stake: <span className="font-bold text-yellow-400">{room.stakeAmount} ETH</span></p>
                  <p className="text-gray-400">Players: {room.currentPlayers}/{room.maxPlayers}</p>
                </div>
                <button
                  onClick={() => handleJoinRoom(room.id)}
                  disabled={selectedCards.length !== 3}
                  className={`w-full py-2 rounded font-semibold transition-all ${
                    selectedCards.length === 3
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {selectedCards.length === 3 ? '⚔️ Join Room' : `Select 3 Cards (${selectedCards.length}/3)`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Room / Select Cards */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">
          {showCreateForm ? '⚡ Create Battle Room' : '🎴 Select 3 Cards to Battle'}
        </h2>

        {/* Card Selection */}
        {collection.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400">You need cards to battle. Mint some first!</p>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 rounded bg-blue-900/20 border border-blue-700/30">
              <p className="text-blue-300 text-sm">
                ✓ Selected {selectedCards.length}/3 cards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {collection.map((card, idx) => {
                const isSelected = selectedCards.find((c) => c.id === card.id && c.name === card.name);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCardSelection(card)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'bg-blue-900/30 border-blue-500'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white">{card.name}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded capitalize ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {card.rarity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{card.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-gray-300">Power: {card.power}</span>
                      {isSelected && <span className="text-blue-400 font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stake & Create */}
            {selectedCards.length === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Stake Amount (ETH)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="flex-1 px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
                    />
                    <span className="flex items-center px-3 bg-gray-700 rounded border border-gray-600 text-gray-300 text-sm font-semibold">
                      ETH
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCreateRoom}
                  className="w-full py-3 rounded font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  🚀 Create & Enter Battle Room
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
