import { useState, useEffect } from 'react';
import { Contract, formatEther } from 'ethers';
import { useContract } from './useContract';
import poolABI from '../abis/StakingPool.json'; 

interface AnalyticsData {
  totalTVL: number;
  averageAPR: number;
  totalStakers: number;
  userStaked: number;
  userRewards: number;
  chartData: number[];
}

export const useAnalytics = () => {
  const { factory, account } = useContract();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTVL: 0,
    averageAPR: 0,
    totalStakers: 0,
    userStaked: 0,
    userRewards: 0,
    chartData: [],
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!factory) return;

      try {
        const signer = await factory.getSigner(); // ethers v6 requires await
        const allPools: string[] = await factory.getAllPools();

        let totalTVL = 0,
          totalAPR = 0,
          totalStakers = 0,
          userStaked = 0,
          userRewards = 0;
        const chartData: number[] = [];

        for (const addr of allPools) {
          const pool = new Contract(addr, poolABI, signer);
          const info = await factory.getPoolInfo(addr);

          const stakedRaw = await pool.totalStaked();
          const staked = parseFloat(formatEther(stakedRaw));
          totalTVL += staked;
          totalAPR += info.apr / 100; // info.apr is number
          const stakerCount = parseInt(await pool.totalStakers(), 10);
          totalStakers += stakerCount;
          chartData.push(staked);

          if (account) {
            const balRaw = await pool.stakedBalance(account);
            const rewRaw = await pool.getPendingRewards(account);

            const bal = parseFloat(formatEther(balRaw));
            const rew = parseFloat(formatEther(rewRaw));
            userStaked += bal;
            userRewards += rew;
          }
        }

        setAnalytics({
          totalTVL,
          averageAPR: totalAPR / allPools.length || 0,
          totalStakers,
          userStaked,
          userRewards,
          chartData,
        });
      } catch (error) {
        console.error('Analytics failed:', error);
      }
    };

    loadAnalytics();
  }, [factory, account]);

  return analytics;
};
