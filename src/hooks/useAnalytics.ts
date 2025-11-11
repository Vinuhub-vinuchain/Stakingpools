import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';

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
        const allPools = await factory.getAllPools();
        let totalTVL = 0,
          totalAPR = 0,
          totalStakers = 0,
          userStaked = 0,
          userRewards = 0;
        const chartData: number[] = [];

        for (const addr of allPools) {
          const pool = new ethers.Contract(addr, poolABI, factory.signer);
          const info = await factory.getPoolInfo(addr);
          const staked = ethers.utils.formatEther(await pool.totalStaked());
          totalTVL += parseFloat(staked);
          totalAPR += parseFloat(info.apr / 100);
          totalStakers += parseInt(await pool.totalStakers(), 10);
          chartData.push(parseFloat(staked));

          if (account) {
            const bal = ethers.utils.formatEther(await pool.stakedBalance(account));
            const rew = ethers.utils.formatEther(await pool.getPendingRewards(account));
            userStaked += parseFloat(bal);
            userRewards += parseFloat(rew);
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
