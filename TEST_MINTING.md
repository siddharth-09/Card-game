# Testing NFT Minting

## Prerequisites
1. **MetaMask installed** on your browser
2. **Base Sepolia testnet** added to MetaMask (chainId: 84532)
3. **Testnet ETH** - Get from: https://www.basescan.io/faucet

## Steps to Test Minting

### 1. Start Dev Server
```bash
export DATABASE_URL="postgresql://postgres:Siddharth@09@db.lzdnoensrzlvaxeanmal.supabase.co:5432/postgres"
bun run dev
```
Open http://localhost:3000

### 2. Connect Wallet
- Click "Connect Wallet" button
- Select MetaMask
- Make sure you're on **Base Sepolia** network
- Approve connection

### 3. Get Testnet ETH
- If you don't have ETH, go to: https://www.basescan.io/faucet
- Or use: https://www.base.org/faucet
- Paste your wallet address
- Request ETH

### 4. Mint Cards
- Go to **Mint** tab
- Enter stake amount (e.g., 0.01 ETH)
- Click **"🎴 Mint 3 Cards"**
- Approve transaction in MetaMask
- Wait for confirmation

### 5. Verify in Database
```bash
bun run db:studio
```
- Open http://localhost:5555
- Go to "Player" table
- Should see your wallet address with cards minted

## Contract Details
- **Address**: 0xB0994D8b46DeF871aC40152d87c72d2F9BF284a3
- **Network**: Base Sepolia
- **Function**: mintCard(name, rarity, power, traits[], imageUri)
- **Cost**: 0.01 ETH per card

## Troubleshooting

### "Contract address not configured"
- Check `.env.local` has `NEXT_PUBLIC_CONTRACT_ADDRESS`
- Restart dev server

### "Not enough balance"
- Get more testnet ETH from faucet
- Each mint costs 0.01 ETH

### "Network mismatch"
- Make sure MetaMask is on Base Sepolia (84532)
- Not on Ethereum mainnet or other chain

### Transaction fails
- Check gas price (Base Sepolia has cheap gas)
- Make sure contract address is correct
- Verify you have at least 0.02 ETH (mint + gas)

## Success Indicators
✅ Transaction appears in MetaMask
✅ Card reveal animation shows 3 cards
✅ Player record appears in Supabase
✅ Stats update in Leaderboard

