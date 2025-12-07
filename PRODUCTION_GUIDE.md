# 🎴 Base Card Game - Production Deployment Guide

## Overview

This is a production-ready NFT card game on Base Sepolia with:
- ✅ Real NFT minting with ERC-721 standard
- ✅ Sequential 1v1 card battles
- ✅ Global leaderboard system
- ✅ Player profiles and statistics
- ✅ Real wallet integration (wagmi/viem)
- ✅ Base Sepolia testnet support

## Prerequisites

- Node.js 18+ or Bun
- A wallet with Base Sepolia ETH (free from faucet)
- Foundry (for contract deployment)

## Step 1: Smart Contract Deployment

### 1.1 Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
~/.foundryup
```

### 1.2 Deploy Contract

```bash
# Get private key from your wallet (MetaMask export)
export PRIVATE_KEY=0x...your_private_key_here

# Deploy to Base Sepolia
forge create contracts/CardGame.sol:CardGameNFT \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --etherscan-api-key YOUR_BASESCAN_KEY \
  --verify

# Example output:
# Deployed to: 0x1234567890123456789012345678901234567890
```

### 1.3 Set Environment Variable

Copy the deployed contract address and create `.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

## Step 2: Application Setup

### 2.1 Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 2.2 Run Development Server

```bash
bun run dev
# or
npm run dev
```

Visit `http://localhost:3000`

## Step 3: Testing the Game

### 3.1 Connect Wallet

1. Install MetaMask or any Web3 wallet
2. Add Base Sepolia network:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency: ETH

3. Get free testnet ETH from: https://sepolia-faucet.pk910.de/

### 3.2 Mint Cards

1. Go to "⚡ Mint" tab
2. Enter stake amount (e.g., 0.01 ETH)
3. Click "🎴 Mint 3 Cards"
4. Sign transaction in wallet
5. Reveal 3 random NFT cards

### 3.3 Battle Cards

1. Go to "⚔️ Battle" tab
2. Create room or join existing
3. Select 3 cards to bring to battle
4. Play 1 card at a time against opponent
5. Winner is first to eliminate all 3 opponent cards

### 3.4 Check Stats

1. Go to "👤 Profile" tab to see your stats:
   - Total wins/losses
   - Win rate percentage
   - ETH earned
   - Cards owned

2. Go to "🏆 Leaderboard" tab to see global rankings

## Features

### Card System
- **8 Base Characters**: Anya, Kaelen, Zephyr, Thorne, Drakon Guardian, Sermaa Fina, Ignis Shamar, Stra Caller
- **3 Rarity Tiers**: Common (50%), Rare (35%), Legendary (15%)
- **Power Variation**: Each card has ±8% power variance per mint
- **NFT Storage**: Cards stored as ERC-721 tokens on blockchain

### Battle System
- **Sequential Format**: Play 1 card per round (not all 3 at once)
- **Hidden Opponent**: Can't see opponent's cards until revealed
- **Power Comparison**: Higher power card wins the round
- **Fair RNG**: ±3% variance on power for edge cases
- **Best of 3**: First to win 3 rounds wins the battle

### Leaderboard
- **Real-time Rankings**: Sorted by wins
- **Player Stats**: Wins, losses, win rate, earnings, cards owned
- **Historical Data**: Stored on blockchain permanently
- **Top 10 Display**: Shows top players with badges

### Player Profile
- **Personal Stats**: All-time wins, losses, earnings
- **Card Collection**: View all owned cards
- **Win Rate**: Calculated percentage
- **Last Battle**: Timestamp of most recent battle

## Architecture

### Frontend (React/Next.js)
- `components/CardGame.tsx` - Main game container
- `components/CardMinting.tsx` - NFT minting interface
- `components/BattleRoom.tsx` - Sequential battle UI
- `components/Leaderboard.tsx` - Global rankings
- `components/PlayerProfile.tsx` - Player stats and cards
- `components/RoomList.tsx` - Multiplayer room browser

### Backend (Next.js API Routes)
- `/app/api/rooms/route.ts` - Room management & battle logic
- `/app/api/contract/route.ts` - Blockchain interactions

### Smart Contract (Solidity)
- `/contracts/CardGame.sol` - ERC-721 card NFT
  - `mintCard()` - Mint new card
  - `recordBattle()` - Update player stats
  - `getLeaderboard()` - Get top 10 players
  - `getPlayerStats()` - Individual player stats

### Libraries
- `lib/cards.ts` - Card pool & rarity system
- `lib/rooms-api.ts` - API client functions
- `lib/contract-service.ts` - Contract interaction hooks
- `lib/contract-config.ts` - Contract ABI & addresses
- `lib/sequential-battle.ts` - Battle logic & rules

## Configuration

### Card Pool (`lib/cards.ts`)

Modify the `CARD_POOL` to add/change cards:

```typescript
{
  id: 'unique-id',
  name: 'Card Name',
  rarity: 'common' | 'rare' | 'legendary',
  power: 70, // base power
  traits: ['trait1', 'trait2'],
  imageUrl: 'https://...',
  description: 'Card description'
}
```

### Rarity Weights (`lib/cards.ts`)

```typescript
export const RARITY_WEIGHTS = {
  common: 50,    // 50% chance
  rare: 35,      // 35% chance
  legendary: 15  // 15% chance
};
```

### Contract Addresses (`lib/contract-config.ts`)

Update after deployment:

```typescript
export const CONTRACT_ADDRESSES = {
  CardGameNFT: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x...',
};
```

## Gas Optimization Tips

1. **Batch Operations**: Mint 3 cards in one transaction
2. **Optimize Images**: Use compressed images for IPFS
3. **Contract Storage**: Use efficient packing for card metadata
4. **Leaderboard**: Cache top 10 off-chain, sync every 10 seconds

## Security Considerations

1. **Wallet Security**:
   - Never share private keys
   - Use hardware wallets for mainnet
   - Test thoroughly on testnet first

2. **Contract Security**:
   - Already has Ownable pattern for battle recording
   - Consider adding:
     - Rate limiting on mint
     - Pause functionality
     - Withdraw safeguards

3. **Frontend Security**:
   - All wallet interactions signed by user
   - No private keys stored locally
   - HTTPS only in production

## Mainnet Deployment (Future)

When ready for mainnet (Base):

1. Deploy contract on Base mainnet
2. Update chain ID in wagmi config (8 instead of 84532)
3. Update RPC URL to mainnet
4. Set real ETH stake amounts
5. Deploy frontend to production server

## Troubleshooting

### "Contract not deployed"
- Check `NEXT_PUBLIC_CONTRACT_ADDRESS` is set
- Verify contract deployed to correct address
- Use BaseScan to verify contract

### Cards not showing after mint
- Wait for block confirmation
- Check wallet connection
- Verify contract address matches

### Battle not starting
- Both players must click "Ready"
- Check room status shows "battling"
- Verify both selected 3 cards

### Leaderboard empty
- Contract needs time to index
- Check multiple battles recorded
- May need to refresh page

## Performance Metrics

- Mint transaction: ~100k gas
- Battle recording: ~80k gas
- Leaderboard fetch: ~2s (depends on player count)

## Future Enhancements

- [ ] Marketplace for card trading
- [ ] Daily challenges
- [ ] Tournament system
- [ ] Achievements/badges
- [ ] Card leveling system
- [ ] PvP ranking seasons
- [ ] Mobile app
- [ ] Discord bot integration

## Support

For issues:
1. Check BaseScan for contract verification
2. Review console errors in browser DevTools
3. Verify wallet is on Base Sepolia
4. Check .env.local has correct contract address

## License

MIT - See LICENSE file

---

**Ready to play? Deploy the contract, set the env var, and start minting cards!** 🎴
