// src/hooks/useContract.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

// === FULL ABIs (exactly matching the deployed contracts) ===
const factoryABI = [
  "constructor(address _feeWallet)",
  "event PoolCreated(address indexed poolAddress, address creator, address token, uint256 apr, uint256 lockDays, uint256 minStake, string name, string description)",
  "function CREATE_FEE() view returns (uint256)",
  "function createPool(address stakeToken, uint256 apr, uint256 lockDays, uint256 minStake, string name, string description) payable",
  "function feeWallet() view returns (address)",
  "function getAllPools() view returns (address[])",
  "function getPoolInfo(address poolAddress) view returns ((address poolAddress, address stakeToken, uint256 apr, uint256 lockDays, uint256 minStake, string name, string description))",
  "function getUserPools(address user) view returns (address[])"
];

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
  "function lastStakedTime(address) view returns (uint256)",
  "function stake(uint256 amount)",
  "function unstake()",
  "function getPendingRewards(address user) view returns (uint256)",
  "function claimRewards()",
  "function pause(bool _status)"
];

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

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS || "0xEb82A52577AF54C2Fc40c3695f144aEa3FD7a4E3";

export const useContract = () => {
  const { provider, account } = useWeb3();
  const [factory, setFactory] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, factoryABI, signer);
      setFactory(factoryContract);
    }
  }, [provider]);

  const getPoolContract = (poolAddress: string) => {
    if (!provider || !account) return null;
    return new ethers.Contract(poolAddress, poolABI, provider.getSigner());
  };

  const getTokenContract = (tokenAddress: string) => {
    if (!provider) return null;
    return new ethers.Contract(tokenAddress, erc20ABI, provider.getSigner());
  };

  return { factory, getPoolContract, getTokenContract, account };
};
