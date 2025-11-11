import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS || '0xEb82A52577AF54C2Fc40c3695f144aEa3FD7a4E3';

const factoryABI = [/* Same factoryABI as in original index.html */];
const poolABI = [/* Same poolABI as in original index.html */];
const erc20ABI = [/* Same erc20ABI as in original index.html */];

export const useContract = () => {
  const { provider, account } = useWeb3();
  const [factory, setFactory] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (provider) {
      const contract = new ethers.Contract(FACTORY_ADDRESS, factoryABI, provider);
      setFactory(contract);
    }
  }, [provider]);

  const getPoolContract = (poolAddress: string) => {
    if (!provider) return null;
    return new ethers.Contract(poolAddress, poolABI, provider.getSigner());
  };

  const getTokenContract = (tokenAddress: string) => {
    if (!provider) return null;
    return new ethers.Contract(tokenAddress, erc20ABI, provider.getSigner());
  };

  return { factory, getPoolContract, getTokenContract, account };
};
