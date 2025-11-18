import { ethers } from 'ethers';

export interface PoolInfo {
  poolAddress: string;
  stakeToken: string;
  apr: number;        // in basis points (e.g., 1000 = 10%)
  lockDays: number;
  minStake: ethers.BigNumber;
  name: string;
  description: string;
}

export interface PoolStats {
  totalStaked: ethers.BigNumber;
  totalStakers: ethers.BigNumber;
  paused: boolean;
  stakedBalance: ethers.BigNumber;
  pendingRewards: ethers.BigNumber;
}

export interface AnalyticsData {
  totalTVL: number;
  averageAPR: number;
  totalStakers: number;
  userStaked: number;
  userRewards: number;
  chartData: number[];
}

export type ContractInstances = {
  factory: ethers.Contract | null;
  getPool: (address: string) => ethers.Contract | null;
  getToken: (address: string) => ethers.Contract | null;
};
