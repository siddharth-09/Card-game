# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project name**: `card-game` (or your preference)
   - **Database password**: Save this securely
   - **Region**: Choose closest to your users (e.g., `us-west-1`)
5. Click "Create new project" and wait for initialization (2-3 minutes)

## 2. Get Database Connection String

1. In Supabase dashboard, go to **Settings → Database**
2. Look for **Connection string** section
3. Select **URI** tab
4. Copy the connection string (it will look like):
   ```
   postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT.supabase.co:5432/postgres
   ```
5. Update `.env.local`:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT.supabase.co:5432/postgres"
   ```

## 3. Set Up Prisma Migrations

Run the following commands:

```bash
# Generate Prisma Client
bunx prisma generate

# Create and apply migrations
bunx prisma migrate dev --name init

# (Optional) Seed database with game config
bunx prisma db seed
```

## 4. Verify Connection

```bash
bunx prisma studio
```

This will open a browser UI where you can view your database schema and tables.

## 5. Production Deployment (Vercel)

When deploying to Vercel:

1. Add `DATABASE_URL` to Vercel environment variables
2. Run migrations during deployment:
   ```bash
   bunx prisma migrate deploy
   ```

## Important Security Notes

- **Never commit** `.env.local` with real credentials to Git
- Use Supabase's Row Level Security (RLS) for additional security
- Keep database password secure and rotate periodically
- Use separate Supabase projects for dev/staging/production

## Troubleshooting

### Connection Refused
- Ensure you're using the correct password
- Check Supabase project is running (blue dot = active)
- Verify your IP is allowed (Supabase has built-in allowlist)

### Tables Not Created
```bash
bunx prisma migrate reset  # ⚠️ Deletes all data
bunx prisma migrate dev    # Reapply migrations
```

### Prisma Studio Won't Open
```bash
bunx prisma studio --browser none
# Then manually visit: http://localhost:5555
```
