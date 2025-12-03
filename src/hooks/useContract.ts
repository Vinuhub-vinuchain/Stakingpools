import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

import StakingFactoryABI from '../abis/StakingFactory.json';
import StakingPoolABI from '../abis/StakingPool.json';
import ERC20ABI from '../abis/ERC20.json';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS || "0xEb82A52577AF54C2Fc40c3695f144aEa3FD7a4E3";

export const useContract = () => {
  const { provider, account } = useWeb3();
  const [factory, setFactory] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (!provider) return;
    const signer = provider.getSigner();
    setFactory(new ethers.Contract(FACTORY_ADDRESS, StakingFactoryABI, signer));
  }, [provider]);

  const getPool = (address: string) =>
    provider ? new ethers.Contract(address, StakingPoolABI, provider.getSigner()) : null;

  const getToken = (address: string) =>
    provider ? new ethers.Contract(address, ERC20ABI, provider.getSigner()) : null;

  return { factory, getPool, getToken, account };
};
