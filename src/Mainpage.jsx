/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRightLeft, Zap, Clock, Wallet, BarChart2, Settings, Coins, Image, Droplet, ShoppingCart as ImageIcon, Sun, Moon, DollarSign, ShoppingCart } from 'lucide-react';

const chainIcons = {
  'Kopli': '🌐',
  // Corrected Duplicate Chain
};

const tokenIcons = {
  'IVAN': '🦸‍♂',
  'GUILT': '🧿',
  'REACT1': '🔵',
  'REACT2': '🔵',
  'PRKR': '⚙',
  'IAD': '🤖',
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('bridge');
  const [tokenType, setTokenType] = useState('native');
  const [fromChain, setFromChain] = useState('Kopli');
  const [toChain, setToChain] = useState('Kopli');
  const [fromToken, setFromToken] = useState('REACT1');
  const [toToken, setToToken] = useState('REACT2');
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount('');
      setWalletConnected(false);
    }
  };

  const handleChainChanged = (chainId) => {
    setNetwork(ethers.utils.hexValue(chainId));
  };

  const chains = ['Kopli']; // Removed Duplicate 'Kopli'
  const tokens = {
    'native': {
      'Kopli': ['REACT1', 'REACT2'],
    },
    'erc20': {
      'Kopli': ['IVAN', 'GUILT'],
    },
    'erc721': {
      'Kopli': ['CryptoPunks', 'Aurory'],
    },
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        setAccount(address);

        if (network.chainId === 5318008) {
          setNetwork('Kopli');
        } else {
          setNetwork(network.name);
        }

        setWalletConnected(true);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.error('Please install MetaMask!');
    }
  };

  // Fixed Address Shortening Function
  const shortenAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-2)}`;
  };

  const handleAmountChange = (e) => {
    const inputAmount = e.target.value;
    setAmount(inputAmount);
    if (tokenType === 'erc721') {
      setEstimatedAmount(inputAmount); // Use the entered amount directly for NFTs
    } else {
      // For other token types, calculate an estimate (this is a simplified example)
      const parsedAmount = parseFloat(inputAmount);
      if (!isNaN(parsedAmount)) {
        setEstimatedAmount((parsedAmount * 0.1).toFixed(4));
      } else {
        setEstimatedAmount('');
      }
    }
  };

  const initiateBridge = async () => {
    // Add logic for bridge transfer
  };

  const handleAddLiquidity = () => {
    console.log("Add liquidity logic here");
    // Implement the logic to add liquidity
  };

  const handleAcquireTokens = () => {
    console.log("Acquire tokens logic here");
    // Implement the logic to acquire tokens
  };

  return (
    <>
      <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-black text-blue-100'} font-sans flex flex-col transition-colors duration-300`}>
        {/* Header */}
        <header className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'} border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} p-4 transition-colors duration-300`}>
          <div className="container mx-auto flex justify-between items-center">
            <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>ReactiveBridge</h1>
            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme} className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-gray-700 text-gray-300'} transition-colors duration-300`}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={connectWallet}
                className={`px-4 py-2 rounded-md transition-colors flex flex-col items-center justify-center ${
                  walletConnected
                    ? theme === 'light'
                      ? 'bg-black text-white'
                      : 'bg-white text-black'
                    : theme === 'light'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {walletConnected ? (
                  <>
                    <span className="flex items-center">
                      <Wallet className="mr-2" size={18} />
                      {shortenAddress(account)}
                    </span>
                    <span className="text-xs mt-1">{network}</span>
                  </>
                ) : (
                  <span className="flex items-center">
                    <Wallet className="mr-2" size={18} />
                    Connect Wallet
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto mt-8 p-4 flex-grow">
          <div className="flex">
            {/* Left side content */}
            <div className="w-2/3 pr-64">
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Cross-Chain Bridge</h2>

              {/* Tabs */}
              <div className="mb-4 flex space-x-4">
                <button onClick={() => setActiveTab('bridge')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'bridge' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>Bridge</button>
                <button onClick={() => setActiveTab('liquidity')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'liquidity' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>Add Liquidity</button>
                <button onClick={() => setActiveTab('acquire')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'acquire' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>Acquire Tokens</button>
              </div>

              {/* Main content for bridge */}
              {activeTab === 'bridge' && (
                <>
                  <div className="mb-4">
                    <label htmlFor="tokenType" className="block font-semibold mb-1">Token Type:</label>
                    <select id="tokenType" value={tokenType} onChange={(e) => setTokenType(e.target.value)} className="w-full border rounded p-2">
                      <option value="native">Native Token</option>
                      <option value="erc20">ERC-20</option>
                      <option value="erc721">ERC-721</option>
                    </select>
                  </div>

                  {/* From Chain */}
                  <div className="mb-4">
                    <label htmlFor="fromChain" className="block font-semibold mb-1">From Chain:</label>
                    <select id="fromChain" value={fromChain} onChange={(e) => setFromChain(e.target.value)} className="w-full border rounded p-2">
                      {chains.map((chain) => (
                        <option key={chain} value={chain}>{chain}</option>
                      ))}
                    </select>
                  </div>

                  {/* To Chain */}
                  <div className="mb-4">
                    <label htmlFor="toChain" className="block font-semibold mb-1">To Chain:</label>
                    <select id="toChain" value={toChain} onChange={(e) => setToChain(e.target.value)} className="w-full border rounded p-2">
                      {chains.map((chain) => (
                        <option key={chain} value={chain}>{chain}</option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    <label htmlFor="amount" className="block font-semibold mb-1">Amount:</label>
                    <input id="amount" type="text" value={amount} onChange={handleAmountChange} className="w-full border rounded p-2" placeholder="Enter amount" />
                  </div>

                  {/* Estimated Amount */}
                  <div className="mb-4">
                    <label htmlFor="estimatedAmount" className="block font-semibold mb-1">Estimated Amount (on the target chain):</label>
                    <input id="estimatedAmount" type="text" value={estimatedAmount} readOnly className="w-full border rounded p-2" />
                  </div>

                  <div className="flex justify-end">
                    <button onClick={initiateBridge} className={`px-6 py-2 rounded-md bg-blue-600 text-white transition-colors hover:bg-blue-700`}>Initiate Bridge</button>
                  </div>
                </>
              )}

              {/* Add Liquidity */}
              {activeTab === 'liquidity' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Add Liquidity</h3>
                  <button onClick={handleAddLiquidity} className={`px-6 py-2 rounded-md bg-blue-600 text-white transition-colors hover:bg-blue-700`}>Add Liquidity</button>
                </div>
              )}

              {/* Acquire Tokens */}
              {activeTab === 'acquire' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Acquire Tokens</h3>
                  <button onClick={handleAcquireTokens} className={`px-6 py-2 rounded-md bg-blue-600 text-white transition-colors hover:bg-blue-700`}>Acquire Tokens</button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
