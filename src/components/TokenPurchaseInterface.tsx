import React, { useState, useEffect } from 'react';

// If Reown AppKit provides a specific hook to open the modal, that would be used here.
// For example, similar to useWeb3Modal() from '@web3modal/wagmi/react'

// Assuming we'll integrate with web3 libraries later
const TokenPurchaseInterface: React.FC = () => {
  // States for UI
  const [walletConnected, setWalletConnected] = useState(false);
  const [ethAmount, setEthAmount] = useState('');
  const [estimatedTokens, setEstimatedTokens] = useState('0');
  const [slippage, setSlippage] = useState('0.5');
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  
  // Token data
  const tokenAddress = '0x9985bEBaB2181E961E755b6D5Cc81e4626a4cFCd';
  const tokenSymbol = 'SON';
  const tokenDecimals = 18;
  const tokenImage = '/android-chrome-192x192.png'; // Use your token image path
  const tokenBalance = '0';
  const tokenPrice = '0.00001';
  
  // Listen for connection events from Reown AppKit
  useEffect(() => {
    // This would be the proper event listener for Reown AppKit
    // Example: window.addEventListener('appkit-connection-changed', handleConnectionChange);
    
    // For now, we're just simulating this
    const mockAppkitElement = document.querySelector('appkit-button');
    if (mockAppkitElement) {
      mockAppkitElement.addEventListener('click', () => {
        // In a real implementation, this would be triggered by an actual event
        setTimeout(() => setWalletConnected(true), 500);
      });
    }
    
    return () => {
      // Cleanup event listeners
      // Example: window.removeEventListener('appkit-connection-changed', handleConnectionChange);
      if (mockAppkitElement) {
        mockAppkitElement.removeEventListener('click', () => {});
      }
    };
  }, []);
  
  const handleAddToken = async () => {
    try {
      // Check if ethereum provider exists (MetaMask or other wallet)
      const ethereum = window.ethereum as any;
      
      if (ethereum && typeof ethereum.request === 'function') {
        const wasAdded = await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image: tokenImage,
            },
          },
        });

        if (wasAdded) {
          console.log('Token was added to wallet!');
        } else {
          console.log('User rejected adding the token.');
        }
      } else {
        console.error('No Ethereum provider found');
        alert('Please install MetaMask or another Ethereum wallet to add tokens');
      }
    } catch (error) {
      console.error('Error adding token to wallet:', error);
      alert('Error adding token. Please try again or add manually.');
    }
  };
  
  const handleEthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEthAmount(value);
    // Display estimated tokens (1 ETH = 100,000 SON in this example)
    setEstimatedTokens(value ? (parseFloat(value) * 100000).toString() : '0');
  };
  
  const handleSwap = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) return;
    
    setTxStatus('pending');
    
    try {
      // Try to get the Reown AppKit element first
      const appkitElement = document.querySelector('appkit-button') as any;
      
      // Check if we can access the connected wallet through Reown AppKit
      if (appkitElement && typeof appkitElement.getProvider === 'function') {
        // Get the wallet provider from Reown AppKit
        const provider = await appkitElement.getProvider();
        
        // Get the current account
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        
        // Convert ETH amount to wei (1 ETH = 10^18 wei)
        const weiAmount = `0x${(parseFloat(ethAmount) * 1e18).toString(16)}`;
        
        // Create the transaction parameters
        const transactionParameters = {
          from: account,
          to: tokenAddress, // The token or swap contract address
          value: weiAmount, // Amount of ETH to send
        };
        
        // Send the transaction to the connected wallet for approval
        const txHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
        
        console.log('Transaction submitted through Reown AppKit:', txHash);
        setTxStatus('success');
      } 
      // Fallback to direct ethereum access if Reown AppKit method not available
      else {
        const ethereum = window.ethereum as any;
        
        if (ethereum && typeof ethereum.request === 'function') {
          // Get the current account
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          const account = accounts[0];
          
          // Convert ETH amount to wei (1 ETH = 10^18 wei)
          const weiAmount = `0x${(parseFloat(ethAmount) * 1e18).toString(16)}`;
          
          // Create the transaction parameters
          const transactionParameters = {
            from: account,
            to: tokenAddress, // The token or swap contract address
            value: weiAmount, // Amount of ETH to send
          };
          
          // Send the transaction to the wallet for approval
          const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
          });
          
          console.log('Transaction submitted through window.ethereum:', txHash);
          setTxStatus('success');
        } else {
          throw new Error('No wallet found. Please connect your wallet using the button above.');
        }
      }
      
      // Reset form after successful transaction
      setTimeout(() => {
        setEthAmount('');
        setEstimatedTokens('0');
        setTxStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Swap failed:', error);
      setTxStatus('error');
    }
  };
  
  const copyAddress = () => {
    navigator.clipboard.writeText(tokenAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="section-box p-6 md:p-8 rounded-md my-8">
      <h2 className="text-2xl md:text-3xl font-bold text-accent mb-4 text-center">Get LittleDude (SON)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card-box p-5 rounded-md">
          <h3 className="text-xl font-bold text-white mb-2">Token Info</h3>
          <p className="text-[#b0b0b0]">
            <strong>Name:</strong> LittleDude<br/>
            <strong>Symbol:</strong> SON<br/>
            <strong>Blockchain:</strong> Base (L2)<br/>
            <strong>Token Type:</strong> ERC-20
          </p>
        </div>
        
        <div className="card-box p-5 rounded-md">
          <h3 className="text-xl font-bold text-white mb-2">Token Address</h3>
          <div className="flex items-center justify-between bg-black/30 p-2 rounded-md mb-3">
            <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-accent text-sm">
              {tokenAddress}
            </div>
            <button 
              onClick={copyAddress}
              className="ml-2 px-2 py-1 bg-accent/20 hover:bg-accent/30 rounded-md transition-colors text-xs text-white"
              aria-label="Copy token address"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
              </svg>
              {copied && <span className="ml-1 text-xs">Copied!</span>}
            </button>
          </div>
          <button
            onClick={handleAddToken}
            className="w-full py-2 bg-accent hover:bg-accent/80 text-white rounded-md transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Add SON to Wallet
          </button>
        </div>
      </div>
      
      <div className="card-box p-5 rounded-md mb-6">
        {/* Always show the Reown AppKit button for connection */}
        <div className="text-center mb-4">
          <p className="text-[#b0b0b0] mb-4">
            Connect your wallet to purchase SON tokens.
          </p>
          <div className="flex justify-center">
            <appkit-button></appkit-button>
          </div>
        </div>
        
        {/* Show our custom swap interface when connected */}
        {walletConnected && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            {/* Warning Banner */}
            <div className="bg-red-900/40 border border-red-500 p-4 rounded-md mb-6">
              <h4 className="text-red-300 font-bold text-lg mb-1">⚠️ Liquidity Pool Not Yet Available</h4>
              <p className="text-[#b0b0b0] text-sm">
                The SON token liquidity pool has not been established yet. <span className="text-red-300 font-bold">DO NOT</span> attempt 
                to send ETH to the token contract as transactions will fail or your funds could be lost. 
                Token swaps will be enabled once sufficient liquidity is added.
              </p>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Swap ETH for SON</h3>
              <div className="text-[#b0b0b0] text-sm">
                Balance: <span className="text-accent ml-1">{tokenBalance} SON</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-[#b0b0b0] text-sm mb-1">
                <span>From</span>
                <span>1 ETH ≈ 100,000 SON</span>
              </div>
              <div className="bg-black/30 p-3 rounded-md mb-2 opacity-60">
                <div className="flex justify-between mb-1">
                  <span className="text-[#b0b0b0] text-sm">ETH</span>
                  <span className="text-[#b0b0b0] text-sm">Balance: 0.0 ETH</span>
                </div>
                <div className="flex items-center">
                  <input 
                    type="number"
                    placeholder="0.0"
                    value={ethAmount}
                    onChange={handleEthChange}
                    disabled={true}
                    className="bg-transparent text-xl text-white outline-none w-full cursor-not-allowed"
                  />
                  <div className="ml-2 font-bold text-white">ETH</div>
                </div>
              </div>
              
              <div className="flex justify-center my-2">
                <div className="w-8 h-8 flex items-center justify-center bg-accent/20 rounded-full text-accent">
                  ↓
                </div>
              </div>
              
              <div className="bg-black/30 p-3 rounded-md opacity-60">
                <div className="flex justify-between mb-1">
                  <span className="text-[#b0b0b0] text-sm">SON</span>
                  <span className="text-[#b0b0b0] text-sm">Estimated</span>
                </div>
                <div className="flex items-center">
                  <div className="text-xl text-white w-full">{estimatedTokens}</div>
                  <div className="ml-2 font-bold text-white">SON</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#b0b0b0] text-sm">Slippage Tolerance</span>
              <div className="flex space-x-2 opacity-60">
                {['0.5', '1.0', '2.0'].map((value) => (
                  <button 
                    key={value}
                    disabled={true}
                    className={`px-2 py-1 rounded-md text-xs ${slippage === value ? 'bg-accent text-white' : 'bg-black/20 text-[#b0b0b0]'} cursor-not-allowed`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
            
            <button
              disabled={true}
              className="w-full py-3 rounded-md font-bold transition-colors bg-gray-700 cursor-not-allowed text-gray-500"
            >
              Swaps Coming Soon
            </button>
            
            <p className="mt-4 text-center text-xs text-amber-400">
              We're working on establishing a liquidity pool. Check back soon!
            </p>
          </div>
        )}
      </div>
      
      <div className="text-xs text-center text-[#b0b0b0] mt-2">
        <p>Trading involves risk. Make sure you understand our tokenomics before trading.</p>
      </div>
    </div>
  );
};

export default TokenPurchaseInterface; 