import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) throw new Error('MetaMask not installed');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const chainId = await provider.send('eth_chainId', []);
      if (chainId !== '0xcf') {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xcf',
            chainName: 'VinuChain',
            rpcUrls: ['https://rpc.vinuchain.org'],
            nativeCurrency: { name: 'VinuChain', symbol: 'VC', decimals: 18 },
            blockExplorerUrls: ['https://explorer.vinuchain.org'],
          }],
        });
      }
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      setProvider(provider);
    } catch (error) {
      throw new Error(`Connection failed: ${(error as Error).message}`);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
  };

  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      connectWallet().catch(console.error);
    }
  }, []);

  return { account, provider, connectWallet, disconnectWallet };
};
