# ✅ Pre-Deployment Checklist

## 🔧 Technical Setup

- [x] Smart contract deployed to Base Sepolia (0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3)
- [x] Supabase database configured and synced
- [x] Environment variables set in `.env.local`
- [x] Vercel configuration (vercel.json) created
- [x] Farcaster frame manifest (/.well-known/farcaster.json) ready
- [x] Production build succeeds locally

## 🚀 Quick Deploy Steps

### Step 1: Push to GitHub (5 min)
```bash
cd /Users/siddharthpanchal/Desktop/Dev/base-farcaster

# Push to your repo:
git remote add origin https://github.com/siddharth-09/base-farcaster.git
git branch -M deploy
git push -u origin deploy
```

### Step 2: Deploy to Vercel (5 min)
```bash
# Visit https://vercel.com/new
# Click "Import Git Repository"
# Search for "base-farcaster"
# Select branch: deploy
# Click Import
```

### Step 3: Configure in Vercel (5 min)
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add these from your `.env.local`:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = `0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3`
   - `NEXT_PUBLIC_CHAIN_ID` = `84532` (or `8453` for mainnet)
   - `NEXT_PUBLIC_RPC_URL` = `https://sepolia.base.org`
   - `NEXT_PUBLIC_PROJECT_ID` = your Reown project ID
   - `DATABASE_URL` = your Supabase connection string
   - `DATABASE_URL_UNPOOLED` = your Supabase unpooled string
3. Click Save
4. Vercel will auto-redeploy

### Step 4: Get Your Live URL (instant)
- Check Vercel dashboard
- Your app is at: `https://your-project.vercel.app`

### Step 5: Register on Farcaster (5 min)
1. Go to https://warpcast.com
2. Create/login to account
3. Go to Profile → Apps
4. Add new app: `https://your-project.vercel.app`
5. Done! Your Farcaster frame is live

## 📋 Environment Variables Reference

```dotenv
# Copy these from your .env.local to Vercel Settings → Environment Variables

# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3
NEXT_PUBLIC_CHAIN_ID=84532                    # Testnet: 84532, Mainnet: 8453
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org  # Testnet, or https://mainnet.base.org

# Farcaster / Reown
NEXT_PUBLIC_PROJECT_ID=ceea9dc0e0883b141a7f175cb72e23e4

# Database
DATABASE_URL=postgresql://postgres:...@db.xxx.supabase.co:5432/postgres
DATABASE_URL_UNPOOLED=postgresql://postgres:...@db.xxx.supabase.co:5432/postgres
```

## 🧪 Testing After Deployment

```bash
# Test homepage loads
curl https://your-project.vercel.app

# Test API endpoints
curl https://your-project.vercel.app/api/leaderboard
curl https://your-project.vercel.app/api/verify-contract

# Test in browser
# 1. Visit https://your-project.vercel.app
# 2. Connect wallet (must be Base Sepolia 84532)
# 3. Try minting (need ~0.01 ETH + gas from faucet)
```

## 🔗 Useful Links

| Service | URL |
|---------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| GitHub | https://github.com |
| Reown Dashboard | https://dashboard.reown.com |
| Supabase | https://supabase.com/dashboard |
| Warpcast | https://warpcast.com |
| Base Sepolia Faucet | https://www.basescan.io/faucet |
| BaseScan Testnet | https://sepolia.basescan.io |
| BaseScan Mainnet | https://basescan.io |

## 📊 Current Status

| Component | Status | Location |
|-----------|--------|----------|
| Smart Contract | ✅ Deployed | Base Sepolia |
| Contract Address | ✅ Set | 0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3 |
| Database | ✅ Configured | Supabase |
| Vercel Config | ✅ Ready | vercel.json |
| Farcaster Frame | ✅ Ready | /.well-known/farcaster.json |
| Build | ✅ Success | Tested locally |

## ⏱️ Total Time to Deploy: ~20 minutes

1. GitHub setup: 5 min
2. Vercel setup: 5 min
3. Environment variables: 5 min
4. Farcaster registration: 5 min

## 🚨 Important Notes

- **Testnet vs Mainnet:** Currently set to `84532` (Base Sepolia testnet). Change to `8453` for mainnet + real ETH
- **Contract Deployment:** Ensure contract is deployed on the chain you specify
- **ETH for Testing:** Get free testnet ETH from https://www.basescan.io/faucet
- **Production Domain:** Update `NEXT_PUBLIC_URL` when you have a custom domain

---

**Ready to deploy? Follow Step 1 above!** 🚀
