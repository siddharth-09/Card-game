# 🎮 Base Sepolia Card Game - Complete Mac Setup

## What's Included (Production Ready)

✅ Real NFT Card Minting on Base Sepolia  
✅ Sequential 1v1 Card Battles  
✅ Global Leaderboard System  
✅ Player Profiles & Statistics  
✅ Real Wallet Integration (MetaMask, Coinbase)  
✅ Smart Contract Integration with ethers.js  
✅ Responsive UI for Mobile & Desktop  

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd /Users/siddharthpanchal/Desktop/Dev/base-farcaster
bun install
```

### 2. Get Testnet ETH (FREE)
Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- You'll receive 0.05 ETH for testing

### 3. Start Development Server
```bash
bun run dev
```

### 4. Open in Browser
```bash
open http://localhost:3002
```

### 5. Connect Wallet
- Install MetaMask or Coinbase Wallet extension
- Switch to **Base Sepolia** network
- Connect your wallet to the game

## How to Play

### Mint Cards
1. Click **"⚡ Mint"** tab
2. Connect wallet if not connected
3. Enter stake amount (min 0.01 ETH)
4. Click **"🎮 Mint 3 Cards"**
5. Confirm transaction in wallet
6. View your 3 random cards!

### Battle Other Players
1. Click **"⚔️ Battle"** tab
2. **Create Room**: Enter stake amount → "Create Battle"
3. **Join Room**: Select 3 cards from collection → "Join"
4. Both players click **"Ready to Battle"**
5. **Select Cards One at a Time**:
   - Each round, select 1 card from your remaining cards
   - Click **"⚔️ Fight"**
   - Wait for opponent to select
   - Cards are compared by power
   - Loser's card is eliminated
6. **Continue** until one player defeats all 3 opponent cards
7. **Winner Gets Rewards!** (2x stake amount)

### View Your Stats
- **Profile Tab**: See your wins/losses, earnings, and cards
- **Leaderboard Tab**: Compete with other players globally

## Key Features

### Smart Contracts on Base Sepolia
- Card NFT minting with ERC-721 standard
- Battle reward system
- Gas-efficient design (super cheap!)

### Leaderboard System
- Real-time ranking by wins
- Win rate percentage
- Total earnings tracked
- Automatic stat updates

### Wallet Integration
- Real Base Sepolia network
- MetaMask & Coinbase Wallet support
- Safe transaction handling

## Important: For Real Deployment

### Step 1: Deploy Smart Contract
See `PRODUCTION_GUIDE.md` for detailed instructions to deploy your own NFT contract.

### Step 2: Update Contract Address
Edit `.env.local`:
```
NEXT_PUBLIC_CARD_NFT_CONTRACT=0x[your_contract_address]
```

### Step 3: Deploy to Vercel
```bash
git push to GitHub
Import in Vercel
Set environment variables
Deploy with 1 click!
```

## Configuration Files

### `.env.local` - Local Development
```
NEXT_PUBLIC_PROJECT_ID=ceea9dc0e0883b141a7f175cb72e23e4
NEXT_PUBLIC_CARD_NFT_CONTRACT=0x...
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_MINT_PRICE=0.01
```

### `next.config.mjs` - Next.js Config
- Production build optimizations
- HTTPS redirection
- Security headers

### `package.json` - Dependencies
- `next@14.2.6` - Framework
- `wagmi@3.1.0` - Web3 wallet hooks
- `ethers@6` - Smart contract interaction
- `viem@2.41.2` - Ethereum utilities
- `tailwind` - UI styling

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14 + React + TypeScript |
| Styling | Tailwind CSS |
| Web3 | wagmi + viem + ethers.js |
| Blockchain | Base Sepolia Testnet |
| Smart Contracts | Solidity + OpenZeppelin |
| API Backend | Next.js API Routes |
| Data Storage | In-memory (PostgreSQL for prod) |
| Deployment | Vercel |

## Useful Commands

```bash
# Start development
bun run dev

# Build for production
bun run build

# Run production build
bun start

# Check for errors
bun run lint

# Format code
bun run format
```

## Troubleshooting

### Wallet Won't Connect
- Switch MetaMask to "Base Sepolia" network
- Ensure you have testnet ETH from faucet
- Clear browser cache and try again

### Cards Won't Mint
- Check you have at least 0.01 ETH
- Verify network is Base Sepolia (84532)
- Allow transaction in wallet popup

### Battle Won't Start
- Both players must click "Ready"
- Ensure both have sufficient cards
- Refresh page if stuck

### Leaderboard Showing Old Data
- Data updates every 10 seconds
- Manual refresh: F5 or Cmd+R

## Support & Resources

📚 **Documentation**
- Base: https://docs.base.org
- Wagmi: https://wagmi.sh
- Next.js: https://nextjs.org

💬 **Communities**
- Base Discord: https://discord.gg/base
- Farcaster: https://warpcast.com

🔗 **Useful Links**
- Base Sepolia Block Explorer: https://sepolia.basescan.org
- Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- Bridge (ETH to Base): https://bridge.base.org

## Next Steps

1. ✅ Play the game with testnet ETH
2. ✅ Deploy your own contract
3. ✅ Setup GitHub repo
4. ✅ Deploy to Vercel
5. ✅ Share with friends!

## Development Tips for Mac

### Use iTerm2 Split Panes
```bash
# In iTerm2: Cmd+D to split
# Left pane: bun run dev
# Right pane: code .
```

### Monitor Dev Server
```bash
bun run dev 2>&1 | tee dev.log
# Logs saved in dev.log for debugging
```

### Kill Port If Stuck
```bash
kill -9 $(lsof -ti:3002)
PORT=3003 bun run dev  # Use different port
```

## Gas Costs (Why Base?)

- Ethereum Mainnet: ~$5-50 per transaction
- Arbitrum: ~$0.10-1 per transaction
- **Base Sepolia**: ~$0.001 per transaction (FREE!)

Base is **100x cheaper** than Ethereum!

## Security Notes

- Never share your private key
- Use testnet ETH only
- Contract addresses are public
- All transactions are on-chain (verifiable)
- Never store secrets in `.env.local` (use .env.production)

---

**Happy Gaming! 🎮**

Questions? Check MAC_SETUP.md for detailed instructions.
