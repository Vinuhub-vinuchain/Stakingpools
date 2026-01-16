import { useState } from 'react';
import { Box, Heading, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { parseEther, formatEther } from 'ethers';
import { useContract } from '../hooks/useContract';

const InteractPool: React.FC = () => {
  const { getPool, getToken, account } = useContract();
  const [poolAddress, setPoolAddress] = useState('');
  const toast = useToast();

  const stake = async () => {
    if (!account) {
      toast({ title: 'Error', description: 'Connect wallet', status: 'error', duration: 5000 });
      return;
    }

    const pool = await getPool(poolAddress); // ✅ await here
    if (!pool) return;

    try {
      const minStake = formatEther(await pool.minStake());
      const amount = prompt(`Enter amount to stake (Min: ${minStake})`);
      if (!amount) return;

      const tokenAddr = await pool.stakeToken();
      const token = await getToken(tokenAddr); // ✅ await here
      if (!token) return;

      const approveTx = await token.approve(poolAddress, parseEther(amount));
      await approveTx.wait();

      const tx = await pool.stake(parseEther(amount));
      await tx.wait();

      toast({ title: 'Success', description: 'Staked successfully', status: 'success', duration: 5000 });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, status: 'error', duration: 5000 });
    }
  };

  const unstake = async () => {
    const pool = await getPool(poolAddress); // ✅ await here
    if (!pool) return;

    try {
      const tx = await pool.unstake();
      await tx.wait();
      toast({ title: 'Success', description: 'Unstaked successfully', status: 'success', duration: 5000 });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, status: 'error', duration: 5000 });
    }
  };

  const claimRewards = async () => {
    const pool = await getPool(poolAddress); // ✅ await here
    if (!pool) return;

    try {
      const tx = await pool.claimRewards();
      await tx.wait();
      toast({ title: 'Success', description: 'Rewards claimed', status: 'success', duration: 5000 });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, status: 'error', duration: 5000 });
    }
  };

  const togglePause = async () => {
    const pool = await getPool(poolAddress); // ✅ await here
    if (!pool) return;

    try {
      const isPaused = await pool.paused();
      const tx = await pool.pause(!isPaused);
      await tx.wait();
      toast({ title: 'Success', description: `Pool ${isPaused ? 'unpaused' : 'paused'}`, status: 'success', duration: 5000 });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, status: 'error', duration: 5000 });
    }
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="lg" mb={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6} color="green.500">
        Interact with Pool
      </Heading>
      <FormControl>
        <FormLabel>Pool Address</FormLabel>
        <Input
          value={poolAddress}
          onChange={(e) => setPoolAddress(e.target.value)}
          placeholder="Pool Address"
        />
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
