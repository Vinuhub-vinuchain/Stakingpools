import type { Contract } from 'ethers';
import type { BigNumberish } from 'ethers';

export interface PoolInfo {
  poolAddress: string;
  stakeToken: string;
  apr: number;     
  lockDays: number;
  minStake: BigNumberish;
  name: string;
  description: string;
}

export interface PoolStats {
  totalStaked: BigNumberish;
  totalStakers: BigNumberish;
  paused: boolean;
  stakedBalance: BigNumberish;
  pendingRewards: BigNumberish;
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
  factory: Contract | null;
  getPool: (address: string) => Contract | null;
  getToken: (address: string) => Contract | null;
};
