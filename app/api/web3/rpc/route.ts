import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { chainId, method, params } = await request.json();
    
    // Determine which RPC URL to use based on chainId
    const rpcUrl = chainId === process.env.BASE_SEPOLIA_CHAIN_ID 
      ? process.env.BASE_RPC_SEPOLIA 
      : process.env.BASE_RPC_URL;

    if (!rpcUrl) {
      return NextResponse.json(
        { error: 'RPC URL not configured' },
        { status: 500 }
      );
    }

    // Forward request to appropriate RPC endpoint
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BASE_CLIENT_API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params
      })
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('RPC request failed:', error);
    return NextResponse.json(
      { error: 'Failed to process RPC request' },
      { status: 500 }
    );
  }
}