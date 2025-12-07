# 🎴 Base Card Game - Quick Start

## What You Get

✅ **Real NFT Minting** - Cards are actual ERC-721 tokens  
✅ **Sequential Battles** - Play 1 card per round, best of 3  
✅ **Live Leaderboard** - Global rankings by wins  
✅ **Player Profiles** - Track wins, losses, earnings  
✅ **Real Wallet** - MetaMask/Coinbase integration  
✅ **Base Sepolia** - Testnet ready (free ETH faucet)  

## Quickest Setup (5 minutes)

### 1. Deploy Contract (2 min)

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash

# Get private key from MetaMask (Settings → Expose account key)
export PRIVATE_KEY=0x...

# Deploy
forge create contracts/CardGame.sol:CardGameNFT \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY
```

Copy the contract address (e.g., 0x1234...)

### 2. Set Environment (1 min)

Create `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### 3. Run Game (2 min)

```bash
bun install
bun run dev
```

Visit http://localhost:3000

### 4. Get Testnet ETH

Go to: https://sepolia-faucet.pk910.de/

### 5. Play!

1. Connect wallet → MetaMask → Base Sepolia
2. Mint cards → ⚡ Mint tab → Enter 0.01 ETH → Sign
3. Battle → ⚔️ Battle → Create room → Play cards
4. Check stats → 👤 Profile & 🏆 Leaderboard

## What Happens

```
User connects wallet
    ↓
Mint 3 random NFT cards (stake 0.01 ETH)
    ↓
Cards appear in collection
    ↓
Create/join battle room with opponent
    ↓
Both players select & play 1 card per round
    ↓
Higher power card wins, loser's card eliminated
    ↓
Repeat 3 times (first to win 3 wins battle)
    ↓
Winner gets 2x ETH, loser loses stake
    ↓
Stats recorded on blockchain forever
    ↓
Appear on global leaderboard
```

## Key Files

**Smart Contract**: `contracts/CardGame.sol` (ERC-721)  
**Card Logic**: `lib/cards.ts` (8 characters, 3 rarities)  
**Battle Logic**: `lib/sequential-battle.ts` (power comparison)  
**UI Components**:
- Minting: `components/CardMinting.tsx`
- Battles: `components/BattleRoom.tsx`
- Profile: `components/PlayerProfile.tsx`
- Leaderboard: `components/Leaderboard.tsx`

## Cards (8 Total)

| Name | Rarity | Power | Traits |
|------|--------|-------|--------|
| Anya | Common | 70 | Swift, Keen |
| Kaelen | Common | 68 | Cunning, Precise |
| Zephyr | Rare | 85 | Flight, Speed |
| Thorne | Rare | 82 | Armor, Guard |
| Drakon Guardian | Rare | 88 | Fire, Scales |
| Sermaa Fina | Legendary | 95 | Magic, Ancient |
| Ignis Shamar | Legendary | 94 | Inferno, Chaos |
| Stra Caller | Legendary | 92 | Summon, Bind |

## Customization

**Change card rarity chances** → `lib/cards.ts` `RARITY_WEIGHTS`  
**Change mint price** → `contracts/CardGame.sol` `mintPrice`  
**Change card pool** → `lib/cards.ts` `CARD_POOL`  
**Change battle rules** → `lib/sequential-battle.ts`  
**Change UI colors** → `components/*.tsx` Tailwind classes  

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Contract not deployed" | Check `.env.local` has correct address |
| Card mint fails | Need Base Sepolia ETH - use faucet above |
| Wallet won't connect | Switch MetaMask to Base Sepolia network |
| Battle won't start | Both players must click "Ready" |
| Stats not updating | Wait 10 seconds for leaderboard refresh |

## Network Details

**Name**: Base Sepolia  
**Chain ID**: 84532  
**RPC**: https://sepolia.base.org  
**Explorer**: https://sepolia.basescan.org  
**Gas**: ~100k to mint, ~80k to record battle  
**Faucet**: https://sepolia-faucet.pk910.de/  

## Advanced Setup

See `PRODUCTION_GUIDE.md` for:
- Architecture details
- Security considerations
- Optimization tips
- Mainnet deployment
- Future enhancements

## Next Steps

1. ✅ Deploy contract → Get address
2. ✅ Set env var → `.env.local`
3. ✅ Run server → `bun run dev`
4. ✅ Connect wallet → MetaMask
5. ✅ Get testnet ETH → Faucet
6. ✅ Mint cards → ⚡ Mint
7. ✅ Battle friends → ⚔️ Battle
8. ✅ Check leaderboard → 🏆 Leaderboard
9. 🚀 Deploy mainnet → Change network ID

**Questions? Check console errors with F12 → Console tab**

---

**Now deploy and start minting! 🎴⚔️**
