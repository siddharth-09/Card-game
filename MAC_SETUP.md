# Base Sepolia Card Game - Mac Setup Guide

## Prerequisites

### 1. Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js & Bun
```bash
brew install node
brew install oven-sh/bun/bun
```

Verify installation:
```bash
node --version
bun --version
```

## Setup Steps

### Step 1: Navigate to Project Directory
```bash
cd /Users/siddharthpanchal/Desktop/Dev/base-farcaster
```

### Step 2: Install Dependencies
```bash
bun install
```

### Step 3: Configure Environment Variables

Edit `.env.local` with your values:

```bash
nano .env.local
```

Update these key values:
```
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_CARD_NFT_CONTRACT=0x...  # Deploy your contract first
NEXT_PUBLIC_GAME_CONTRACT=0x...      # Deploy your contract first
```

### Step 4: Deploy Smart Contracts (Optional - Skip for Testing)

If you want to deploy real contracts to Base Sepolia:

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

2. Create contracts and deploy (see PRODUCTION_GUIDE.md)

### Step 5: Start Development Server

```bash
bun run dev
```

Server will start at: `http://localhost:3002`

## Testing the Game on Mac

### 1. Open in Browser
```bash
open http://localhost:3002
```

### 2. Connect Wallet
- Install MetaMask or Coinbase Wallet extension
- Switch network to **Base Sepolia**
- Get testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

### 3. Play the Game

#### Mint Cards
1. Click "⚡ Mint" tab
2. Enter stake amount (0.01 ETH minimum)
3. Click "Mint 3 Cards"
4. View revealed cards in Collection

#### Battle
1. Click "⚔️ Battle" tab
2. Create or Join a room
3. Both players select cards
4. Battle and win rewards!

#### View Stats
1. Click "👤 Profile" to see your stats
2. Click "🏆 Leaderboard" to see top players

## Mac-Specific Tips

### Terminal Setup
```bash
# Open new terminal window for dev server
cmd + T

# Split terminal pane
cmd + D
```

### File Editing
```bash
# Edit files with VS Code
code .env.local
code .

# Or use nano editor
nano .env.local
```

### Useful Commands

```bash
# Check if port 3002 is in use
lsof -i :3002

# Kill process on port 3002
kill -9 $(lsof -ti:3002)

# View logs
bun run dev 2>&1 | tee logs.txt

# Clean build
rm -rf .next && bun run build

# Run tests
bun test
```

## Troubleshooting

### Port Already in Use
```bash
# Kill the process
kill -9 $(lsof -ti:3002)

# Or use different port
PORT=3003 bun run dev
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
bun install
```

### Slow Performance
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 bun run dev
```

### Hot Reload Not Working
```bash
# Restart dev server
# Ctrl + C to stop
# bun run dev to restart
```

## Deploying to Production

See `PRODUCTION_GUIDE.md` for:
- Smart contract deployment
- Vercel hosting
- Gas optimization
- Database setup

## Resources

- **Base Docs**: https://docs.base.org
- **Farcaster Docs**: https://docs.farcaster.xyz
- **Wagmi Docs**: https://wagmi.sh
- **Next.js Docs**: https://nextjs.org

## Support

Having issues? Check:
1. `.env.local` configuration
2. Wallet connection (MetaMask/Coinbase)
3. Base Sepolia network selection
4. Port 3002 availability
5. Node.js version (16+)

Happy gaming! 🎮
