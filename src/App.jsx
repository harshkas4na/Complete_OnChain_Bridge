import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRightLeft, Zap, Clock, Wallet, BarChart2, Settings, Coins, Image, Droplet, ShoppingCart as ImageIcon, Sun, Moon, DollarSign } from 'lucide-react';
import bridgeABI from './contract/bridgeABI.json';
import originBridgeABI from './contract/originBridgeABI.json';
import NFTBridgeABI from './contract/NFTBridgeABI.json';
import NFTDestination from './contract/NFTDestination.json';

const contractAddressForSep = "0x0b3F3Aa0b70AAd88733fd44Ad235f9283B00d931";
const contractAddressForKop = "0x4218c0deAd65bc2D85a9681A96f8E769B754f603";
const tokenAddressForSep = "0xC891d076e8cf7c3c9D64fCf23832ea6C7C80c8F0";
const tokenAddressForKop= "0x8D4ab1B62B65bF6c97d13F2caBE51E580F778d35";
const erc721OriginBridgeAddress = "0x0b3F3Aa0b70AAd88733fd44Ad235f9283B00d931";
const erc721DestinationBridgeAddress = "0x4218c0deAd65bc2D85a9681A96f8E769B754f603";

const NFT_OriginBridgeSepolia="0x17bf36D7F115Cc8374a155f4516beb4FA572F677";
const NFT_DestinationBridgeKOPLI="0xF5004410AeeC64355c58ff06ACC89e9d67E319c9";
const NFT_DestinationBridgeSepolia="0x73EcA917Bca7fF097157ee224DcacB1fE464dCEB";
const NFT_OriginBridgeKopli="0xD5ac0437E7B9612F1eFc016B7F2F44Eb9fD7241e";

const chainIcons = {
  'Sepolia': '🌐',
  'Kopli': '💠',
};

const tokenIcons = {
  'IVAN': '🦸‍♂️',
  'GUILT': '🧿',
  'REACT1': '🔵',
  'REACT2': '🔵',
  'PRKR': '⚙️',
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
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalLiquidity, setTotalLiquidity] = useState("0");
  const [contractBalance, setContractBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState('');
  const [txId, setTxId] = useState('');
  const [acquireAmount, setAcquireAmount] = useState('');
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [removeLiquidityAmount, setRemoveLiquidityAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [approvalStatus, setApprovalStatus] = useState({});

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

  const handleTokenIdChange = (e) => {
    setTokenId(e.target.value);
    setEstimatedAmount(e.target.value); // For ERC721, the estimated amount is the same as the token ID
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setWalletConnected(true);
    } else {
      setAccount('');
      setWalletConnected(false);
    }
  };

  const handleAddLiquidity = async () => {
    if (!liquidityAmount) {
      alert("Please enter the amount to add as liquidity.");
      return;
    }
    setIsLoading(true);
    try {
      let tx;
      if (network === 'sepolia') {
        const sepContract = new ethers.Contract(contractAddressForSep, bridgeABI, signer);
        tx = await sepContract.addLiquidity({
          value: ethers.utils.parseEther(liquidityAmount),
        });
      } else if (network === 'kopli') {
        const kopContract = new ethers.Contract(contractAddressForKop, bridgeABI, signer);
        tx = await kopContract.addLiquidity({
          value: ethers.utils.parseEther(liquidityAmount),
        });
      } else {
        throw new Error("Unsupported network");
      }
      await tx.wait();
      fetchContractData(contract);
      alert("Liquidity added successfully!");
      setLiquidityAmount('');
    } catch (error) {
      console.error("Error adding liquidity:", error);
      setError("Failed to add liquidity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveLiquidity = async () => {
    if (!removeLiquidityAmount) {
      alert("Please enter the amount to remove as liquidity.");
      return;
    }
    setIsLoading(true);
    try {
      let tx;
      if (network === 'sepolia') {
        const sepContract = new ethers.Contract(contractAddressForSep, bridgeABI, signer);
        tx = await sepContract.removeLiquidity(ethers.utils.parseEther(removeLiquidityAmount));
      } else if (network === 'kopli') {
        const kopContract = new ethers.Contract(contractAddressForKop, bridgeABI, signer);
        tx = await kopContract.removeLiquidity(ethers.utils.parseEther(removeLiquidityAmount));
      } else {
        throw new Error("Unsupported network");
      }
      await tx.wait();
      fetchContractData(contract);
      alert("Liquidity removed successfully!");
      setRemoveLiquidityAmount('');
    } catch (error) {
      console.error("Error removing liquidity:", error);
      setError("Failed to remove liquidity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChainChanged = (chainId) => {
    setNetwork(chainId);
    // Reconnect to the new chain
    connectWallet();
  };

  const chains = ['Kopli', 'Sepolia'];
  const tokens = {
    'native': {
      'Kopli': ['REACT1', 'REACT2'],
      'Sepolia': ['Sepolia1', 'Sepolia2']
    },
    'erc20': {
      'Kopli': [ 'PRKR'],
      'Sepolia': ['IVAN']
    },
    'erc721': {
      'Kopli': ['CryptoPunks'],
      'Sepolia': ['Aurory'],
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setWalletConnected(true);
      
      const tempProvider = new ethers.providers.Web3Provider(ethereum);
      const tempSigner = tempProvider.getSigner();
      const tempContract = new ethers.Contract(contractAddress, bridgeABI, tempSigner);
      
      setProvider(tempProvider);
      setSigner(tempSigner);
      setContract(tempContract);

      const network = await tempProvider.getNetwork();
      setNetwork(network.name);

      // Fetch initial contract data
      fetchContractData(tempContract);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  const handleAmountChange = (e) => {
    const inputAmount = e.target.value;
    setAmount(inputAmount);
    if (tokenType === 'erc721') {
      setEstimatedAmount(inputAmount);
    } else {
      const parsedAmount = parseFloat(inputAmount);
      if (!isNaN(parsedAmount)) {
        setEstimatedAmount((parsedAmount * 0.1).toFixed(4));
      } else {
        setEstimatedAmount('');
      }
    }
  };

  const handleBurn = async () => {
    if (!burnAmount || !contract) {
      alert("Please enter an amount to burn and ensure your wallet is connected.");
      return;
    }
    setIsLoading(true);
    try {
      const tokenAddress = tokenAddresses[fromToken];
      const tokenContract = new ethers.Contract(tokenAddress, originBridgeABI, signer);
      const tx = await tokenContract.burn(ethers.utils.parseEther(burnAmount));
      await tx.wait();
      alert("Tokens burned successfully!");
      setBurnAmount('');
    } catch (error) {
      console.error("Error burning tokens:", error);
      setError("Failed to burn tokens. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approveAmount || !contract) {
      alert("Please enter an amount to approve and ensure your wallet is connected.");
      return;
    }
    setIsLoading(true);
    try {
      const tokenAddress = tokenAddresses[fromToken];
      const tokenContract = new ethers.Contract(tokenAddress,originBridgeABI, signer);
      const tx = await tokenContract.approve(contractAddress, ethers.utils.parseEther(approveAmount));
      await tx.wait();
      alert("Approval successful!");
      setApproveAmount('');
    } catch (error) {
      console.error("Error approving tokens:", error);
      setError("Failed to approve tokens. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  
  const getTokenAddress = (tokenSymbol) => {
    // This should return the contract address for the given token symbol
    // You might want to maintain a mapping of token symbols to their contract addresses
    const tokenAddressesForSep = {
      'IVAN': '0x3C3E3407c5957ebC026573E0e37a9ae5d02EDEEb',
      'PRKH': '0xC902Ff5E0566B2a3fa065bF64d8438575f57804B',
      // Add other token addresses here
    };
    return tokenAddresses[tokenSymbol];
  };

  const fetchContractData = async (contractInstance) => {
    try {
      const liquidity = await contractInstance.totalLiquidity();
      const balance = await contractInstance.getContractBalance();
      setTotalLiquidity(ethers.utils.formatEther(liquidity));
      setContractBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error fetching contract data:", error);
      setError("Failed to fetch contract data. Please try again.");
    }
  };

  useEffect(() => {
    if (contract) {
      fetchContractData(contract);
    }
  }, [contract]);
  
  

  const calculateTxnId = (address, amount) => {
    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256"],
      [address, ethers.utils.parseEther(amount)]
    );
    return ethers.utils.keccak256(encodedData);
  };

  const getNFTAddress = (chainName, tokenSymbol) => {
    const nftAddresses = {
      'Sepolia': {
        'CryptoPunks': NFTAddressForSep,
        // Add other Sepolia NFT addresses here
      },
      'Kopli': {
        'Aurory': NFTAddressForKop,
        // Add other Kopli NFT addresses here
      },
    };
    return nftAddresses[chainName][tokenSymbol];
  };

  const checkApproval = async (tokenAddress, tokenId) => {
    try {
      const nftContract = new ethers.Contract(tokenAddress, erc721ABI, signer);
      const approvedAddress = await nftContract.getApproved(tokenId);
      return approvedAddress.toLowerCase() === contractAddress.toLowerCase();
    } catch (error) {
      console.error("Error checking approval:", error);
      return false;
    }
  };

  const handleApproveNFT = async () => {
    if (!tokenId || !contract) {
      alert("Please enter a token ID and ensure your wallet is connected.");
      return;
    }
    setIsLoading(true);
    try {
      const nftAddress = getNFTAddress(fromChain, fromToken);
      const nftContract = new ethers.Contract(nftAddress, erc721ABI, signer);
      const tx = await nftContract.approve(contractAddress, tokenId);
      await tx.wait();
      alert("NFT approved successfully!");
      setApprovalStatus({ ...approvalStatus, [tokenId]: true });
    } catch (error) {
      console.error("Error approving NFT:", error);
      setError("Failed to approve NFT. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const initiateBridge = async () => {
    if (!amount || !contract) {
      alert("Please enter an amount/token ID and ensure your wallet is connected.");
      return;
    }
    setIsLoading(true);
    try {
      let tx;
      if (tokenType === 'erc721') {
        const nftAddress = getNFTAddress(fromChain, fromToken);
        const isApproved = await checkApproval(nftAddress, tokenId);
        if (!isApproved) {
          alert("Please approve the NFT first.");
          setIsLoading(false);
          return;
        }
        // Generate a unique transaction ID
        const txId = ethers.utils.id(account + tokenId + Date.now());
        
        // Call the lockNFT function (you'll need to implement this in your smart contract)
        tx = await contract.lockNFT(
          nftAddress,
          tokenId,
          getNFTAddress(toChain, toToken), // Destination NFT contract address
          txId
        );
      if (tokenType === 'erc20') {
        // For ERC20 tokens
        let tokenAddress;
        if (fromChain === 'Sepolia' && toChain === 'Kopli') {
          tokenAddress = tokenAddressForSep;
        } else if (fromChain === 'Kopli' && toChain === 'Sepolia') {
          tokenAddress = tokenAddressForKop;
        } else {
          tokenAddress = getTokenAddress(fromToken); // Use the existing function for other cases
        }
        
        const tokenContract = new ethers.Contract(tokenAddress, originBridgeABI, signer);
        
        // First, approve the bridge contract to spend tokens
        const approveTx = await tokenContract.approve(contractAddress, ethers.utils.parseEther(amount));
        await approveTx.wait();
        
        // Generate a unique transaction ID
        const txId = ethers.utils.id(account + amount + Date.now());
        
        // Now call the lockTokens function
        tx = await tokenContract.lockTokens(
          tokenAddress,
          ethers.utils.parseEther(amount),
          toChain === 'Sepolia' ? tokenAddressForSep : tokenAddressForKop, // Use the appropriate address for the destination chain
          txId
        );
      } else if (tokenType === 'native') {
        // For native tokens (existing logic)
        const calculatedTxnId = calculateTxnId(account, amount);
        tx = await contract.deposit(calculatedTxnId, {
          value: ethers.utils.parseEther(amount),
        });
      } else {
        // For ERC721 tokens (You may need to implement this part)
        throw new Error("ERC721 bridging not implemented yet");
      }
      
      await tx.wait();
      fetchContractData(contract);
      alert("Bridge initiated successfully!");
    } 

  } catch (error) {
    console.error("Error initiating bridge:", error);
    setError("Failed to initiate bridge. Please try again.");
  } finally {
    setIsLoading(false);
  }
  };

  const handleAcquireTokens = async () => {
    if (!acquireAmount) {
      alert("Please enter the amount to acquire tokens (add liquidity).");
      return;
    }
    setIsLoading(true);
    try {
      const tx = await contract.addLiquidity({
        value: ethers.utils.parseEther(acquireAmount),
      });
      await tx.wait();
      fetchContractData(contract);
      alert("Tokens acquired successfully (liquidity added)!");
    } catch (error) {
      console.error("Error acquiring tokens:", error);
      setError("Failed to acquire tokens. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
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
            <p className={`mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Transfer your assets seamlessly across multiple blockchain networks with our secure and efficient bridge.
            </p>
            <ul className={`list-disc list-inside ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              <li>Support for multiple chains and tokens</li>
              <li>Fast and economical transfers</li>
            </ul>
            {/* New Liquidity and Token Acquisition Options */}
            <div className="mt-80 space-y-4">
            <div className="mt-8 space-y-4">
              <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Liquidity Management</h3>
              
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(e.target.value)}
                  placeholder="Amount to add"
                  className={`w-48 p-2 rounded-md ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-gray-200'} border ${theme === 'light' ? 'border-gray-300' : 'border-gray-700'}`}
                />
                <button
                  onClick={handleAddLiquidity}
                  className={`w-48 ${
                    theme === 'light'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white py-2 px-4 rounded-md font-semibold transition-all duration-300 flex items-center justify-center`}
                >
                  <Droplet className="mr-2" size={18} />
                  Add Liquidity
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={removeLiquidityAmount}
                  onChange={(e) => setRemoveLiquidityAmount(e.target.value)}
                  placeholder="Amount to remove"
                  className={`w-48 p-2 rounded-md ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-gray-200'} border ${theme === 'light' ? 'border-gray-300' : 'border-gray-700'}`}
                />
                <button
                  onClick={handleRemoveLiquidity}
                  className={`w-48 ${
                    theme === 'light'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white py-2 px-4 rounded-md font-semibold transition-all duration-300 flex items-center justify-center`}
                >
                  <Droplet className="mr-2" size={18} />
                  Remove Liquidity
                </button>
              </div>
            </div>

              {tokenType !== 'erc721' && (
                <button
                  onClick={handleAcquireTokens}
                  className={`w-48 ${
                    theme === 'light'
                      ? 'bg-purple-500 hover:bg-purple-700'
                      : 'bg-purple-800 hover:bg-purple-600'
                  } text-white py-2 px-4 rounded-md font-semibold transition-all duration-300 flex items-center justify-center`}
                >
                  <ImageIcon className="mr-2" size={18} />
                  Acquire Tokens
                </button>
              )}
            </div>
          </div>

          {/* Bridge interface */}
          <div className="w-2/3">
            <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'} rounded-lg p-6 shadow-lg ${theme === 'light' ? 'border border-gray-200' : 'border border-gray-800'}`}>
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setActiveTab('bridge')}
                  className={`px-4 py-2 rounded-md ${activeTab === 'bridge' ? (theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (theme === 'light' ? 'text-blue-600 hover:bg-gray-100' : 'text-blue-300 hover:bg-gray-800')}`}
                >
                  Bridge
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded-md ${activeTab === 'history' ? (theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (theme === 'light' ? 'text-blue-600 hover:bg-gray-100' : 'text-blue-300 hover:bg-gray-800')}`}
                >
                  History
                </button>
                
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'bridge' && (
                    <motion.div
                      key="bridge"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-6">
                      <div className="flex justify-center space-x-4 mb-6">
                        {['native', 'erc20', 'erc721'].map((type) => (
                          <motion.button
                            key={type}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTokenType(type)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                              tokenType === type
                                ? (theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                : (theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-800 text-blue-300 hover:bg-gray-700')
                            } transition-all duration-300`}
                          >
                            {type === 'native' && <DollarSign className="w-5 h-5" />}
                            {type === 'erc20' && <Coins className="w-5 h-5" />}
                            {type === 'erc721' && <ImageIcon className="w-5 h-5" />}
                            <span className="capitalize">{type}</span>
                          </motion.button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>From Chain</label>
                          <div className="relative">
                            <select
                              value={fromChain}
                              onChange={(e) => {
                                setFromChain(e.target.value)
                                setFromToken(tokens[tokenType][e.target.value][0])
                              }}
                              className={`w-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                              {chains.map((chain) => (
                                <option key={chain} value={chain}>{chainIcons[chain]} {chain}</option>
                              ))}
                            </select>
                            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} size={16} />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>To Chain</label>
                          <div className="relative">
                            <select
                              value={toChain}
                              onChange={(e) => {
                                setToChain(e.target.value)
                                setToToken(tokens[tokenType][e.target.value][0])
                              }}
                              className={`w-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                              {chains.map((chain) => (
                                <option key={chain} value={chain}>{chainIcons[chain]} {chain}</option>
                              ))}
                            </select>
                            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} size={16} />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center my-4">
                        <ArrowRightLeft className={`${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} size={24} />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>From Token</label>
                          <div className="relative">
                            <select
                              value={fromToken}
                              onChange={(e) => setFromToken(e.target.value)}
                              className={`w-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                              {tokens[tokenType][fromChain].map((token) => (
                                <option key={token} value={token}>{tokenIcons[token]} {token}</option>
                              ))}
                            </select>
                            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} size={16} />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>To Token</label>
                          <div className="relative">
                            <select
                              value={toToken}
                              onChange={(e) => setToToken(e.target.value)}
                              className={`w-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                              {tokens[tokenType][toChain].map((token) => (
                                <option key={token} value={token}>{tokenIcons[token]} {token}</option>
                              ))}
                            </select>
                            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} size={16} />
                          </div>
                        </div>
                      </div>

                      <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>
                        {tokenType === 'erc721' ? 'NFT ID' : 'Amount'}
                      </label>
                      <input
                        type="text"
                        value={tokenType === 'erc721' ? tokenId : amount}
                        onChange={tokenType === 'erc721' ? handleTokenIdChange : handleAmountChange}
                        className={`w-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder={tokenType === 'erc721' ? "Enter NFT ID" : "Enter amount"}
                      />
                    </div>

                      {estimatedAmount && (
                        <div className={`p-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-md`}>
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {tokenType === 'erc721' 
                              ? 'NFT to be transferred:' 
                              : 'Estimated amount you will receive:'}
                          </p>
                          <p className={`text-lg font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                            {estimatedAmount} {tokenType === 'erc721' ? 'NFT' : toToken}
                          </p>
                        </div>
                      )}

                      <div className={`flex justify-between text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        <span className="flex items-center"><Clock className="mr-2" size={16} /> Est. Time: 5 mins</span>
                        <span className="flex items-center"><Zap className="mr-2" size={16} /> 
                          Fee: {tokenType === 'erc721' ? 'No fee' : '0.1%'}
                        </span>
                      </div>

                      <button
                        onClick={initiateBridge}
                        disabled={isLoading || !amount}
                        className={`w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white py-3 rounded-md font-semibold transition-all duration-300 ${
                          isLoading || !amount ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? 'Processing...' : 'Initiate Bridge'}
                      </button>
                      {tokenType === 'erc20' && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <input
                              type="text"
                              value={burnAmount}
                              onChange={(e) => setBurnAmount(e.target.value)}
                              placeholder="Amount to burn"
                              className={`w-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <button
                              onClick={handleBurn}
                              className={`w-full mt-2 ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white py-2 rounded-md font-semibold transition-all duration-300 flex items-center justify-center`}
                            >
                              {/* <Flame className="mr-2" size={18} /> */}
                              Burn {fromToken}
                            </button>
                          </div>
                          <div>
                            <input
                              type="text"
                              value={approveAmount}
                              onChange={(e) => setApproveAmount(e.target.value)}
                              placeholder="Amount to approve"
                              className={`w-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <button
                              onClick={handleApprove}
                              className={`w-full mt-2 ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white py-2 rounded-md font-semibold transition-all duration-300 flex items-center justify-center`}
                            >
                              {/* <Check className="mr-2" size={18} /> */}
                              Approve {fromToken}
                            </button>
                          </div>
                        </div>
                      )}
                            {tokenType === 'erc721' && (
                              <div className="mt-4">
                                <button
                                  onClick={handleApproveNFT}
                                  className={`w-full ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white py-2 rounded-md font-semibold transition-all duration-300 flex items-center justify-center`}
                                >
                                  {/* <Check className="mr-2" size={18} /> */}
                                  Approve NFT
                                </button>
                              </div>
                            )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
                <footer className={`${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} py-6 border-t mt-auto`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            &copy; 2023 ReactiveBridge. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" aria-label="Statistics" className={`${theme === 'light' ? 'text-gray-600 hover:text-blue-600' : 'text-gray-400 hover:text-blue-400'} transition-colors`}>
              <BarChart2 size={20} />
            </a>
            <a href="#" aria-label="Settings" className={`${theme === 'light' ? 'text-gray-600 hover:text-blue-600' : 'text-gray-400 hover:text-blue-400'} transition-colors`}>
              <Settings size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
