/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/hooks/useWeb3.js

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CONTRACT_ABI, CHAIN_CONFIG } from '../config/contracts';

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contracts, setContracts] = useState({});
  const [currentChainId, setCurrentChainId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeWeb3();
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

  const initializeWeb3 = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      const accounts = await web3Provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);

      const { chainId } = await web3Provider.getNetwork();
      setCurrentChainId(chainId);

      initializeContracts(web3Provider);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const initializeContracts = (provider) => {
    const signer = provider.getSigner();
    const contractInstances = {};
    
    for (const [network, address] of Object.entries(CONTRACT_ADDRESSES)) {
      contractInstances[network] = new ethers.Contract(address, CONTRACT_ABI, signer);
    }
    
    setContracts(contractInstances);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    window.location.reload();
  };

  const switchNetwork = async (networkName) => {
    try {
      const config = CHAIN_CONFIG[networkName];
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [CHAIN_CONFIG[networkName]],
        });
      } else {
        throw error;
      }
    }
  };

  return {
    account,
    provider,
    contracts,
    currentChainId,
    loading,
    error,
    switchNetwork
  };
};