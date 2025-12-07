'use client';

import { Card } from '@/types';
import { getRarityColor, getRarityBadge } from '@/lib/cards';

interface CardRevealProps {
  card: Card;
  isRevealing?: boolean;
}

export function CardReveal({ card, isRevealing = false }: CardRevealProps) {
  const rarityColor = getRarityColor(card.rarity);
  const rarityBadge = getRarityBadge(card.rarity);

  return (
    <div
      className={`w-full max-w-sm mx-auto transition-all duration-500 ${
        isRevealing ? 'animate-pulse' : ''
      }`}
    >
      {/* Card Container */}
      <div
        className="rounded-lg border-2 overflow-hidden shadow-2xl"
        style={{ borderColor: rarityColor }}
      >
        {/* Card Header */}
        <div
          className="px-4 py-3 text-white"
          style={{ backgroundColor: rarityColor + '20' }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{card.name}</h2>
            <span className="text-xl" style={{ color: rarityColor }}>
              {rarityBadge}
            </span>
          </div>
          <p className="text-sm capitalize mt-1">{card.rarity}</p>
        </div>

        {/* Card Image (Placeholder) */}
        <div
          className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-b border-gray-700"
          style={{
            backgroundImage: `linear-gradient(135deg, ${rarityColor}20 0%, transparent 100%)`,
          }}
        >
          <div className="text-center">
            <div className="text-6xl mb-2">🎴</div>
            <p className="text-gray-400 text-sm">Card artwork coming soon</p>
          </div>
        </div>

        {/* Card Stats */}
        <div className="px-4 py-4 space-y-3">
          {/* Power Score */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Power Score</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                  style={{ width: `${(card.power / 100) * 100}%` }}
                />
              </div>
              <span className="text-white font-bold">{card.power}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-300 text-sm italic">{card.description}</p>
          </div>

          {/* Traits */}
          <div>
            <p className="text-gray-400 text-xs mb-2">TRAITS</p>
            <div className="flex flex-wrap gap-2">
              {card.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-2 py-1 rounded text-xs font-semibold text-white bg-gray-700"
                  style={{ borderLeft: `3px solid ${rarityColor}` }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div
          className="px-4 py-2 text-center text-xs text-gray-400 border-t border-gray-700"
          style={{ backgroundColor: rarityColor + '10' }}
        >
          Card #{card.id}
        </div>
      </div>
    </div>
  );
}
