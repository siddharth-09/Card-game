'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Dashboard Link */}
        <div className="flex items-center gap-8">
          <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition">
            ⚔️ Card Battle
          </a>
          <a href="/score" className="text-gray-300 hover:text-white transition font-semibold">
            📊 Leaderboard
          </a>
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center gap-4">
          {isConnected && address ? (
            <div className="flex items-center gap-3 bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          ) : null}

          <button
            onClick={() => open()}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              isConnected
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
            }`}
          >
            {isConnected ? '🔄 Switch Wallet' : '🔗 Connect Wallet'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;