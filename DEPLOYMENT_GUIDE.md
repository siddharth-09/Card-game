# Deployment Guide - Vercel + Supabase

## Prerequisites

- [ ] Git repository initialized and pushed to GitHub
- [ ] Supabase project created with DATABASE_URL
- [ ] Base Sepolia testnet configured
- [ ] Smart contract deployed (address: 0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3)

## Step 1: Prepare for Deployment

### 1.1 Test Locally First
```bash
# Install dependencies
bun install

# Set up database
bun run db:push
bun run db:seed

# Start dev server
bun run dev

# Test in browser
# - Visit http://localhost:3000
# - Connect wallet to Base Sepolia
# - Mint cards, play battles, check leaderboard
```

### 1.2 Verify Environment Variables
```bash
# Check all required vars are set
cat .env.local

# Should have:
# NEXT_PUBLIC_URL
# NEXT_PUBLIC_PROJECT_ID
# NEXT_PUBLIC_CONTRACT_ADDRESS
# NEXT_PUBLIC_CHAIN_ID
# NEXT_PUBLIC_RPC_URL
# DATABASE_URL
```

### 1.3 Build Verification
```bash
# Test production build locally
bun run build
bun run start

# Visit http://localhost:3000 and test again
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /Users/siddharthpanchal/Desktop/Dev/base-farcaster
vercel

# Follow prompts:
# 1. Link to existing project or create new
# 2. Confirm project settings
# 3. Wait for deployment
```

### Option B: Using GitHub Integration (Automated)

```bash
# 1. Push to GitHub
git add .
git commit -m "chore: production setup"
git push origin main

# 2. Visit https://vercel.com/new
# 3. Import repository
# 4. Vercel auto-detects Next.js
# 5. Add environment variables (see step below)
# 6. Deploy
```

## Step 3: Configure Environment Variables in Vercel

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add each variable:

```
NEXT_PUBLIC_URL=https://your-domain.vercel.app
NEXT_PUBLIC_PROJECT_ID=ceea9dc0e0883b141a7f175cb72e23e4
NEXT_PUBLIC_CONTRACT_ADDRESS=0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
DATABASE_URL=postgresql://postgres:PASSWORD@PROJECT.supabase.co:5432/postgres
NEYNAR_API_KEY=your_key_here (optional)
UPSTASH_REDIS_REST_URL=your_url_here (optional)
UPSTASH_REDIS_REST_TOKEN=your_token_here (optional)
```

3. Click "Save" and redeploy

## Step 4: Run Database Migrations

### Option A: Automatic (Vercel Build)

Add to `vercel.json`:
```json
{
  "buildCommand": "bun run db:push && next build"
}
```

Then redeploy on Vercel.

### Option B: Manual

After deployment, run migrations manually:
```bash
# Connect to production database
DATABASE_URL="your_production_url" bunx prisma db push

# Seed production data
DATABASE_URL="your_production_url" bun run db:seed
```

## Step 5: Custom Domain (Optional)

1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., card-game.your-domain.com)
3. Add DNS records as shown
4. Update `NEXT_PUBLIC_URL` to new domain

## Step 6: Post-Deployment Verification

### Check Deployment
```bash
# Your app is live at: https://PROJECT.vercel.app

# Verify in browser:
# 1. Open https://PROJECT.vercel.app
# 2. Connect wallet to Base Sepolia
# 3. Get testnet ETH from faucet
# 4. Mint cards
# 5. Check leaderboard (verify data saves to Supabase)
# 6. Play battles
```

### Monitor Deployment
```bash
# View logs in Vercel dashboard:
# Deployments → Latest → View Logs

# Check for errors:
# - Server errors
# - Database connection issues
# - Missing environment variables
```

### Database Health Check
```bash
# Connect to production database
DATABASE_URL="your_prod_url" bunx prisma studio

# Verify:
# - Tables created
# - Initial game config present
# - No migration errors
```

## Step 7: CI/CD Setup (Automatic Deployments)

### Automatic Deployment on Git Push
Vercel automatically deploys when you push to main:

```bash
# Make changes locally
git add .
git commit -m "feat: new feature"
git push origin main

# Vercel automatically:
# 1. Builds the project
# 2. Runs migrations
# 3. Deploys to production
# 4. Runs post-deploy checks
```

### Preview Deployments
Every pull request gets a preview URL:
```bash
# Create feature branch
git checkout -b feature/new-game-mode

# Make changes and push
git add .
git commit -m "feat: new game mode"
git push origin feature/new-game-mode

# GitHub: Create pull request
# Vercel: Creates preview URL for testing
# Link in PR description
```

## Step 8: Monitoring & Maintenance

### Set Up Alerts
1. Vercel Dashboard → Settings → Alerts
2. Enable:
   - Build failures
   - Deployment errors
   - Edge network errors

### Monitor Application
```bash
# View real-time logs
vercel logs

# Check status
vercel status

# View analytics
# Vercel Dashboard → Analytics → View metrics
```

### Database Maintenance
```bash
# Weekly: Check database size
# Monthly: Review slow queries
# Quarterly: Backup Supabase

# In Supabase Dashboard:
# 1. Settings → Backups
# 2. Check retention policy
# 3. Monitor database size
```

## Troubleshooting

### Database Connection Error
```bash
# Verify DATABASE_URL in Vercel
# Check Supabase project is running
# Test connection locally:
DATABASE_URL="your_url" bunx prisma db execute --stdin < /dev/null
```

### Build Fails
```bash
# Check Vercel build logs
# Common issues:
# - Missing dependencies: bun install
# - Type errors: bun run build --verbose
# - Database migration errors: DATABASE_URL="..." bunx prisma db push --skip-generate
```

### Contract Address Not Found
```bash
# Verify in Vercel env vars:
# NEXT_PUBLIC_CONTRACT_ADDRESS=0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3
# Then redeploy
```

## Rollback (If Needed)

```bash
# Vercel Dashboard → Deployments
# 1. Find previous working deployment
# 2. Click "..." menu
# 3. Select "Promote to Production"
```

---

## Final Checklist

- [ ] App loads on production URL
- [ ] Wallet connects to Base Sepolia
- [ ] Can mint NFTs
- [ ] Leaderboard shows data from Supabase
- [ ] Battles save to database
- [ ] No console errors
- [ ] Database backups configured
- [ ] Monitoring alerts set up

**Deployment complete! 🚀**
