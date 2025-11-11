import { useState } from 'react';
import { Box, Heading, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';

const InteractPool: React.FC = () => {
  const { getPoolContract, getTokenContract, account } = useContract();
  const [poolAddress, setPoolAddress] = useState('');
  const toast = useToast();

  const stake = async () => {
    if (!account) {
      toast({ title: 'Error', description: 'Connect wallet', status: 'error', duration: 5000 });
      return;
    }
    const pool = getPoolContract(poolAddress);
    if (!pool) return;
    const minStake = ethers.utils.formatEther(await pool.minStake());
    const amount = prompt(`Enter amount to stake (Min: ${minStake})`);
    if (amount) {
      try {
        const tokenAddr = await pool.stakeToken();
        const token = getTokenContract(tokenAddr);
        if (!token) return;
        await token.approve(poolAddress, ethers.utils.parseEther(amount)).send();
        const tx = await pool.stake(ethers.utils.parseEther(amount)).send();
        await tx.wait();
        toast({ title: 'Success', description: 'Staked successfully', status: 'success', duration: 5000 });
      } catch (error) {
        toast({ title: 'Error', description: (error as Error).message, status: 'error', duration: 5000 });
      }
    }
  };

  const unstake = async () => {
    const pool = getPoolContract(poolAddress);
    if (!pool) return;
    try {
      const tx = await pool.unstake().send();
      await tx.wait();
      toast({ title: 'Success', description: 'Unstaked successfully', status: 'success', duration: 5000 });
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, status: 'error', duration: 5000 });
    }
  };

  const claimRewards = async () => {
    const pool = getPoolContract(poolAddress);
    if (!pool) return;
    try {
      const tx = await pool.claimRewards().send();
      await tx.wait();
      toast({ title: 'Success', description: 'Rewards claimed', status: 'success', duration: 5000 });
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, status: 'error', duration: 5000 });
    }
  };

  const togglePause = async () => {
    const pool = getPoolContract(poolAddress);
    if (!pool) return;
    const isPaused = await pool.paused();
    try {
      const tx = await pool.pause(!isPaused).send();
      await tx.wait();
      toast({ title: 'Success', description: `Pool ${isPaused ? 'unpaused' : 'paused'}`, status: 'success', duration: 5000 });
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, status: 'error', duration: 5000 });
    }
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="lg" mb={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6} color="green.500">
        Interact with Pool
      </Heading>
      <FormControl>
        <FormLabel>Pool Address</FormLabel>
        <Input value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} placeholder="Pool Address" />
        <Box mt={4}>
          <Button
            bgGradient="linear(to-r, green.500, green.300)"
            color="white"
            mr={2}
            onClick={stake}
          >
            Stake
          </Button>
          <Button
            bgGradient="linear(to-r, green.500, green.300)"
            color="white"
            mr={2}
            onClick={unstake}
          >
            Unstake
          </Button>
          <Button
            bgGradient="linear(to-r, green.500, green.300)"
            color="white"
            mr={2}
            onClick={claimRewards}
          >
            Claim Rewards
          </Button>
          <Button
            bgGradient="linear(to-r, green.500, green.300)"
            color="white"
            onClick={togglePause}
          >
            Toggle Pause
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
};

export default InteractPool;
