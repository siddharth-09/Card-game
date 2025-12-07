#!/bin/bash
# Quick start scripts for Card Game production setup

# Development
alias dev="export DATABASE_URL='postgresql://postgres:Siddharth@09@db.lzdnoensrzlvaxeanmal.supabase.co:5432/postgres' && bun run dev"
alias db-studio="export DATABASE_URL='postgresql://postgres:Siddharth@09@db.lzdnoensrzlvaxeanmal.supabase.co:5432/postgres' && bun run db:studio"
alias build="bun run build"
alias seed="export DATABASE_URL='postgresql://postgres:Siddharth@09@db.lzdnoensrzlvaxeanmal.supabase.co:5432/postgres' && bunx tsx prisma/seed.ts"
alias migrate="export DATABASE_URL='postgresql://postgres:Siddharth@09@db.lzdnoensrzlvaxeanmal.supabase.co:5432/postgres' && bunx prisma db push --skip-generate"

# Copy these to your ~/.zshrc to use them:
# 
# export DATABASE_URL="postgresql://postgres:Siddharth@09@db.lzdnoensrzlvaxeanmal.supabase.co:5432/postgres"
# alias dev="cd /Users/siddharthpanchal/Desktop/Dev/base-farcaster && bun run dev"
# alias db-studio="cd /Users/siddharthpanchal/Desktop/Dev/base-farcaster && bun run db:studio"
# alias build="cd /Users/siddharthpanchal/Desktop/Dev/base-farcaster && bun run build"
# alias seed="cd /Users/siddharthpanchal/Desktop/Dev/base-farcaster && bunx tsx prisma/seed.ts"
# alias migrate="cd /Users/siddharthpanchal/Desktop/Dev/base-farcaster && bunx prisma db push --skip-generate"

echo "Quick start commands available:"
echo "  dev          - Start development server with Supabase"
echo "  build        - Build for production"
echo "  db-studio    - Open Prisma Studio"
echo "  seed         - Seed database with config"
echo "  migrate      - Migrate schema to database"
