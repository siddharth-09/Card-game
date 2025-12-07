# 🚀 Deployment Guide: Vercel + Farcaster

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Create a new repo on GitHub (https://github.com/new)
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/base-farcaster.git
git branch -M main
git push -u origin main
```

### 1.2 Update Environment Variables

Update `.env.local` with your production values:

```dotenv
# Production URLs (use HTTPS)
NEXT_PUBLIC_URL="https://your-domain.vercel.app"

# Smart Contract (use mainnet or testnet)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3
NEXT_PUBLIC_CHAIN_ID=84532  # Base Sepolia (84532) or Base Mainnet (8453)
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org  # or https://mainnet.base.org

# Supabase Database
DATABASE_URL=your_supabase_connection_string
DATABASE_URL_UNPOOLED=your_supabase_unpooled_connection_string

# Farcaster (optional)
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
NEYNAR_API_KEY=your_neynar_api_key

# Redis (optional, for rate limiting)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

---

## Step 2: Deploy to Vercel

### 2.1 Connect to Vercel

**Option A: Via Web Dashboard (Recommended)**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Search for `base-farcaster`
4. Select branch: **`deploy`**
5. Click "Import"

**Option B: Via CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to GitHub account
# - Select your repository (siddharth-09/base-farcaster)
# - Select branch: deploy
```

### 2.2 Configure Environment Variables

In Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_CHAIN_ID`
   - `NEXT_PUBLIC_RPC_URL`
   - `DATABASE_URL`
   - `DATABASE_URL_UNPOOLED`
   - `NEXT_PUBLIC_PROJECT_ID`
   - `NEYNAR_API_KEY` (if using Neynar)
   - `UPSTASH_REDIS_REST_URL` (if using Redis)
   - `UPSTASH_REDIS_REST_TOKEN` (if using Redis)

3. Click "Save"

### 2.3 Trigger Deployment

```bash
git push origin deploy
```

Vercel will automatically build and deploy on every push to `main`.

**Check deployment status:**
- Dashboard: https://vercel.com/dashboard
- Production URL: `https://your-project.vercel.app`

---

## Step 3: Deploy to Farcaster

### 3.1 Create Farcaster Frame Manifest

The app includes a Farcaster frame at `/.well-known/farcaster.json` ✓

### 3.2 Register Your App

1. **Get your Vercel URL:**
   - Go to https://vercel.com/dashboard
   - Copy your production URL (e.g., `https://base-farcaster.vercel.app`)

2. **Register on Warpcast:**
   - Go to https://warpcast.com
   - Create/login to your account
   - Go to profile → Apps
   - Add new app with URL: `https://your-domain.vercel.app`

3. **Test in Farcaster:**
   - Share your app URL in a cast
   - Farcaster should recognize it and show a frame preview
   - Click to launch the mini-app

### 3.3 Share Your App

**Cast Example:**
```
Check out my NFT card game on Base! 🎴
https://your-domain.vercel.app
```

---

## Step 4: Verify Deployment

### 4.1 Test Endpoints

```bash
# Check health
curl https://your-domain.vercel.app

# Test leaderboard API
curl https://your-domain.vercel.app/api/leaderboard

# Test contract verification
curl https://your-domain.vercel.app/api/verify-contract
```

### 4.2 Test Wallet Integration

1. Visit https://your-domain.vercel.app
2. Click "Connect Wallet"
3. Ensure you're on **Base Sepolia (84532)** or **Base Mainnet (8453)**
4. Connect with MetaMask or supported wallet
5. Check that wallet address appears

### 4.3 Test Minting (Testnet)

1. Get testnet ETH: https://www.basescan.io/faucet
2. Try minting a card (should cost ~0.01 ETH + gas)
3. Check transaction on: https://sepolia.basescan.io

---

## Step 5: Monitor & Maintain

### 5.1 Vercel Monitoring
- Check Analytics: https://vercel.com/dashboard → Project → Analytics
- Monitor logs: https://vercel.com/dashboard → Project → Logs
- Check deployments: https://vercel.com/dashboard → Project → Deployments

### 5.2 Database Monitoring
- Supabase dashboard: https://supabase.com/dashboard
- Check connection status
- Monitor query performance

### 5.3 Smart Contract Monitoring
- **Sepolia:** https://sepolia.basescan.io
- **Mainnet:** https://basescan.io
- Search your contract address

---

## Troubleshooting

### Build Fails on Vercel

**Solution:**
```bash
# Check build locally first
bun run build

# View build logs in Vercel dashboard
# Settings → Deployments → Click failed deployment → View logs
```

### Environment Variables Not Loading

**Solution:**
```bash
# Verify variables in Vercel dashboard
# Make sure they're set for Production environment
# Redeploy: git push origin main
```

### Database Connection Fails

**Solution:**
```bash
# Check DATABASE_URL in Vercel
# Ensure Supabase is running
# Test locally: DATABASE_URL=... bun run dev
```

### Wallet Not Connecting

**Solution:**
```bash
# Check NEXT_PUBLIC_PROJECT_ID in Vercel
# Get from: https://dashboard.reown.com
# Ensure RPC URL is correct for your chain
```

---

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Environment variables set in Vercel
- [ ] Production deployment successful
- [ ] Health check passes: `curl https://your-domain.vercel.app`
- [ ] API endpoints working
- [ ] Wallet connection works
- [ ] Contract address correct for your chain
- [ ] Database connection verified
- [ ] Testnet ETH obtained (for testing)
- [ ] Successfully minted a test card
- [ ] Farcaster frame registered
- [ ] Cast created with your app link

---

## Useful Links

- **Vercel:** https://vercel.com
- **GitHub:** https://github.com
- **Base Docs:** https://docs.base.org
- **Farcaster:** https://warpcast.com
- **Reown:** https://dashboard.reown.com
- **Supabase:** https://supabase.com/dashboard
- **BaseScan Testnet:** https://sepolia.basescan.io
- **BaseScan Mainnet:** https://basescan.io

---

## Support

- **Issues?** Check Vercel logs: Dashboard → Deployments → View logs
- **Database questions?** See Supabase docs
- **Smart contract issues?** Check contract on BaseScan

Good luck! 🚀
