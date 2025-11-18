// src/hooks/useContract.ts
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS || "0xEb82A52577AF54C2Fc40c3695f144aEa3FD7a4E3";

// FULL FACTORY ABI
const factoryABI = [
  "constructor(address _feeWallet)",
  "event PoolCreated(address indexed poolAddress, address creator, address token, uint256 apr, uint256 lockDays, uint256 minStake, string name, string description)",
  "function CREATE_FEE() view returns (uint256)",
  "function feeWallet() view returns (address)",
  "function allPools(uint256) view returns (address)",
  "function allPoolsLength() view returns (uint256)",
  "function createPool(address stakeToken, uint256 apr, uint256 lockDays, uint256 minStake, string name, string description) payable returns (address)",
  "function getAllPools() view returns (address[])",
  "function getUserPools(address user) view returns (address[])"
];

// FULL POOL ABI
const poolABI = [
  "function stakeToken() view returns (address)",
  "function creator() view returns (address)",
  "function apr() view returns (uint256)",
  "function lockDays() view returns (uint256)",
  "function minStake() view returns (uint256)",
  "function totalStaked() view returns (uint256)",
  "function totalStakers() view returns (uint256)",
  "function paused() view returns (bool)",
  "function stakedBalance(address) view returns (uint256)",
  "function lastStakeTime(address) view returns (uint256)",
  "function pendingRewards(address user) view returns (uint256)",
  "function stake(uint256 amount)",
  "function unstake()",
  "function claimRewards()",
  "function pause(bool status)"
];

// FULL ERC20 ABI
const erc20ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

export const useContract = () => {
  const { provider, account } = useWeb3();
  const [factory, setFactory] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      setFactory(new ethers.Contract(FACTORY_ADDRESS, factoryABI, signer));
    }
  }, [provider]);

  const getPool = (addr: string) => 
    provider ? new ethers.Contract(addr, poolABI, provider.getSigner()) : null;

  const getToken = (addr: string) => 
    provider ? new ethers.Contract(addr, erc20ABI, provider.getSigner()) : null;

  return { factory, getPool, getToken, account };
};
