import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

export async function GET() {
  try {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org';

    console.log('Verifying contract at:', contractAddress);
    console.log('RPC URL:', rpcUrl);

    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });

    // Get contract code to verify it exists
    const code = await client.getBytecode({ address: contractAddress });

    // Get mint price
    const mintPrice = await client.call({
      account: contractAddress,
      to: contractAddress,
      data: '0x6817c76c', // mintPrice() function selector
    });

    return NextResponse.json({
      success: true,
      contractAddress,
      contractExists: code && code !== '0x',
      codeLength: code?.length || 0,
      rpcUrl,
      chain: 'Base Sepolia',
      chainId: 8453,
      message: code && code !== '0x' ? '✅ Contract exists and is deployed' : '❌ No contract code found',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unknown error',
        details: error,
      },
      { status: 500 }
    );
  }
}
