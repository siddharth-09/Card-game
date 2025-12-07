# Production Readiness Checklist

## ✅ Database Setup (Supabase PostgreSQL)

- [ ] Create Supabase project at https://supabase.com
- [ ] Get DATABASE_URL from Settings → Database
- [ ] Update `.env.local` with DATABASE_URL
- [ ] Run `bun run db:push` to create tables
- [ ] Run `bun run db:seed` to initialize game config
- [ ] Test connection with `bun run db:studio`

## ✅ Smart Contract

- [x] Contract deployed to Base Sepolia: `0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3`
- [x] Contract address in `.env.local`
- [ ] Test minting on testnet (get faucet ETH from https://www.basescan.io/faucet)
- [ ] Verify contract interaction works end-to-end

## ✅ Environment Variables

### Required for Development
```env
# Next.js
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_PROJECT_ID=ceea9dc0e0883b141a7f175cb72e23e4

# Blockchain
NEXT_PUBLIC_CONTRACT_ADDRESS=0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# Database
DATABASE_URL=postgresql://...

# APIs (Optional)
NEYNAR_API_KEY=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### For Production (Vercel)
- [ ] Add all above env vars to Vercel project settings
- [ ] Use production Supabase project connection string
- [ ] Update `NEXT_PUBLIC_URL` to production domain

## ✅ Code Quality

- [x] Logger service implemented
- [x] Environment validation (lib/env.ts)
- [x] Error handling in API routes
- [x] TypeScript strict mode
- [x] Prisma ORM for database
- [x] Input validation on API endpoints

## ✅ API Security

- [ ] Add rate limiting (implement next-rate-limit)
- [ ] Add CORS configuration
- [ ] Validate all user inputs (Zod schemas)
- [ ] Add authentication for sensitive endpoints
- [ ] Enable Supabase Row Level Security (RLS)

## 🔄 Testing Checklist

### Local Testing
```bash
# Start development server
bun run dev

# Open http://localhost:3000
# 1. Connect wallet (MetaMask with Base Sepolia)
# 2. Get testnet ETH from faucet
# 3. Mint 3 cards
# 4. View collection
# 5. Start battle
# 6. Check leaderboard (should see player stats)
# 7. Open Prisma Studio: bun run db:studio
```

### Before Deployment
- [ ] All APIs return proper error responses
- [ ] Database queries optimized
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Leaderboard displays correct data
- [ ] Battle results save to database
- [ ] Player stats update correctly

## 🚀 Deployment to Vercel

### 1. Push to Git
```bash
git add .
git commit -m "feat: production setup with Supabase"
git push origin main
```

### 2. Deploy to Vercel
```bash
# Option A: CLI
npm i -g vercel
vercel

# Option B: GitHub Integration
# 1. Push to GitHub
# 2. Visit vercel.com
# 3. Import repository
# 4. Add environment variables
# 5. Deploy
```

### 3. Run Migrations in Production
Vercel will automatically run `npm run build`, but to run migrations:
```bash
# Add to vercel.json
{
  "buildCommand": "bun run db:push && next build"
}
```

## 📊 Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Monitor database performance
- [ ] Track API response times
- [ ] Monitor transaction success rates

## 📝 Documentation

- [x] Setup guide (SUPABASE_SETUP.md)
- [x] Environment variables documented
- [ ] API documentation
- [ ] Smart contract documentation
- [ ] Deployment guide

## Security Hardening

### Before Production
- [ ] Rotate database password regularly
- [ ] Enable Supabase backups
- [ ] Set up CORS whitelist
- [ ] Enable HTTPS only
- [ ] Disable debug logging in production
- [ ] Mask sensitive data in logs

### Supabase Security
- [ ] Enable Row Level Security (RLS)
- [ ] Create policies for each table
- [ ] Set up database backups
- [ ] Enable audit logging

## Post-Deployment

- [ ] Monitor logs for errors
- [ ] Check leaderboard updates
- [ ] Test NFT minting works
- [ ] Verify battle mechanics
- [ ] Monitor database queries
- [ ] Check API performance

---

**Status**: Configuration phase complete, ready for local testing
