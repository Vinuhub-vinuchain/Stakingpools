import { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { useWeb3 } from './useWeb3';

import StakingFactoryABI from '../abis/StakingFactory.json';
import StakingPoolABI from '../abis/StakingPool.json';
import ERC20ABI from '../abis/ERC20.json';

const FACTORY_ADDRESS: string =
  String(import.meta.env.VITE_FACTORY_ADDRESS) ||
  '0xEb82A52577AF54C2Fc40c3695f144aEa3FD7a4E3';

export const useContract = () => {
  const { provider, account } = useWeb3();
  const [factory, setFactory] = useState<Contract | null>(null);

  // Load factory contract
  useEffect(() => {
    if (!provider) return;

    const loadFactory = async () => {
      const signer = await provider.getSigner();
      const factoryContract = new Contract(
        FACTORY_ADDRESS,
        StakingFactoryABI,
        signer
      );
      setFactory(factoryContract);
    };

    loadFactory();
  }, [provider]);

  // Helper to get a pool contract
  const getPool = async (address: string): Promise<Contract | null> => {
    if (!provider) return null;
    const signer = await provider.getSigner();
    return new Contract(address, StakingPoolABI, signer);
  };

  // Helper to get a token contract
  const getToken = async (address: string): Promise<Contract | null> => {
    if (!provider) return null;
    const signer = await provider.getSigner();
    return new Contract(address, ERC20ABI, signer);
  };

  return { factory, getPool, getToken, account };
};
