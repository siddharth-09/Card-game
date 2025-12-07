# 🎮 Base Farcaster NFT Card Game - Complete Setup

## 📦 What You Have

A production-ready Farcaster mini-app with:

✅ **Smart Contract** (ERC721 NFT)
- Deployed to Base Sepolia (84532)
- Address: `0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3`
- Functions: mintCard, recordBattle, getLeaderboard, etc.

✅ **Frontend** (Next.js + React)
- Wallet integration via Reown AppKit
- Dynamic NFT minting with custom amounts
- Real-time chain validation
- Beautiful UI with Tailwind CSS

✅ **Backend** (API Routes)
- Leaderboard API with persistent database
- Contract verification endpoint
- Rate limiting & security headers
- Supabase PostgreSQL integration

✅ **Database** (Supabase)
- 4 tables: Player, Battle, Card, GameConfig
- Connection pooling configured
- Seed data initialized

✅ **Deployment Ready**
- Vercel configuration (vercel.json)
- Farcaster frame manifest
- Environment variables template
- GitHub ready for CI/CD

---

## 🚀 Deploy Now (3 Simple Steps)

### Step 1: Create GitHub Repo

Your repo is already created: https://github.com/siddharth-09/base-farcaster

### Step 2: Push Code

```bash
cd /Users/siddharthpanchal/Desktop/Dev/base-farcaster

git remote add origin https://github.com/siddharth-09/base-farcaster.git
git branch -M deploy
git push -u origin deploy
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `base-farcaster` repo
4. **Select branch: `deploy`** (important!)
5. Click "Import"
6. Add environment variables (see below)
7. Click "Deploy"

---

## 🔐 Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_CONTRACT_ADDRESS = 0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3
NEXT_PUBLIC_CHAIN_ID = 84532
NEXT_PUBLIC_RPC_URL = https://sepolia.base.org
NEXT_PUBLIC_PROJECT_ID = ceea9dc0e0883b141a7f175cb72e23e4
DATABASE_URL = postgresql://postgres:Siddharth@09@db.lzdnoensrzlvaxeanmal.supabase.co:5432/postgres
DATABASE_URL_UNPOOLED = postgresql://postgres:Siddharth@09@db.lzdnoensrzlvaxeanmal.supabase.co:5432/postgres
```

---

## 📱 Register on Farcaster

Once deployed:

1. Get your Vercel URL (e.g., `https://base-farcaster-abc123.vercel.app`)
2. Go to https://warpcast.com
3. Login/create account
4. Profile → Apps → Add App
5. Paste your Vercel URL
6. Your frame is live! 🎉

---

## 🧪 Testing Checklist

After deployment:

- [ ] Visit your Vercel URL and see the app load
- [ ] Click "Connect Wallet"
- [ ] Make sure you're on **Base Sepolia (84532)**
- [ ] Get testnet ETH: https://www.basescan.io/faucet
- [ ] Try minting a card (costs ~0.01 ETH)
- [ ] Check transaction on https://sepolia.basescan.io
- [ ] View leaderboard at `/api/leaderboard`
- [ ] Share your app on Farcaster!

---

## 📁 Project Structure

```
base-farcaster/
├── app/
│   ├── api/              # API routes (leaderboard, contract)
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── CardMinting.tsx   # NFT minting UI
│   ├── Navbar.tsx        # Navigation
│   ├── providers.tsx     # React providers
│   └── ...
├── lib/
│   ├── kv.ts            # Key-value store
│   ├── rate-limiter.ts  # Rate limiting
│   ├── validation.ts    # Input validation
│   └── ...
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
├── vercel.json          # Vercel config
├── DEPLOY_QUICK_START.md    # This guide
└── README.md
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Blockchain | Wagmi, Viem, Base Sepolia |
| Wallet | Reown AppKit, MetaMask |
| Database | Supabase PostgreSQL, Prisma ORM |
| Deployment | Vercel, GitHub |
| Smart Contract | Solidity (ERC721), Forge |

---

## 💡 Key Features Implemented

### NFT Minting
- Dynamic stake amounts
- Real contract interaction
- Gas estimation
- Transaction tracking

### Leaderboard
- Persistent database
- Player stats (wins/losses)
- Rankings system
- Real-time updates

### Security
- Rate limiting (10 req/10s)
- Input validation with Zod
- Environment validation
- CORS headers

### User Experience
- Chain validation warnings
- Dynamic error messages
- Farcaster frame support
- Responsive design

---

## 🔗 Important Links

| Resource | Link |
|----------|------|
| GitHub | https://github.com/siddharth-09/base-farcaster |
| Vercel Dashboard | https://vercel.com/dashboard |
| Smart Contract | https://sepolia.basescan.io/address/0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3 |
| Farcaster | https://warpcast.com |
| Reown | https://dashboard.reown.com |
| Supabase | https://supabase.com/dashboard |
| Base Testnet | https://sepolia.basescan.io |

---

## ❓ Troubleshooting

### Vercel Build Fails
```bash
# Check locally first
bun run build

# View logs in Vercel dashboard
# Settings → Deployments → Click failed deployment
```

### Wallet Won't Connect
- Check `NEXT_PUBLIC_PROJECT_ID` in Vercel
- Ensure wallet is on Base Sepolia (84532)
- Try different wallet (MetaMask, Coinbase)

### Minting Fails
- Need testnet ETH from faucet
- Check contract address is correct
- View console logs for detailed error

### Database Issues
- Verify `DATABASE_URL` in Vercel
- Check Supabase connection status
- Test locally with same connection string

---

## 📞 Next Steps

1. **Push to GitHub** → Run `git push` commands above
2. **Deploy to Vercel** → Follow Vercel setup steps
3. **Add Environment Variables** → Copy-paste into Vercel
4. **Get Testnet ETH** → Visit Base Faucet
5. **Test Locally** → Try minting on your deployed app
6. **Register on Farcaster** → Share your app!

---

## 🎓 Learning Resources

- **Base Docs:** https://docs.base.org
- **Farcaster Docs:** https://docs.farcaster.xyz
- **Next.js Docs:** https://nextjs.org/docs
- **Wagmi Docs:** https://wagmi.sh
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

**You're ready! Deploy now and show the world your NFT card game 🚀**

Need help? Check the detailed guides:
- `DEPLOY_QUICK_START.md` - Quick reference
- `DEPLOYMENT_INSTRUCTIONS.md` - Detailed steps
