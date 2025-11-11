import { useState } from 'react';
import { Box, Heading, Button, Input, Textarea, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';

const CreatePool: React.FC = () => {
  const { factory, account } = useContract();
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState('');
  const toast = useToast();

  const handleTokenChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const addr = e.target.value.trim();
    setTokenAddress(addr);
    if (ethers.utils.isAddress(addr) && factory) {
      try {
        const token = new ethers.Contract(addr, [
          'function symbol() view returns (string)',
          'function decimals() view returns (uint8)',
        ], factory.signer);
        const symbol = await token.symbol();
        const decimals = await token.decimals();
        setTokenInfo(`Token: ${symbol} (Decimals: ${decimals})`);
      } catch {
        setTokenInfo('Invalid token');
      }
    } else {
      setTokenInfo('');
    }
  };

  const openCreateModal = () => {
    if (!account) {
      toast({ title: 'Error', description: 'Connect wallet first', status: 'error', duration: 5000 });
      return;
    }
    // In a real app, use a modal library like @chakra-ui/modal
    const form = prompt(
      'Enter pool details:\nToken Address, APR (%), Lock Days, Min Stake, Name, Description\n(separated by commas)',
      `${tokenAddress},10,30,100,My Pool,Staking pool`
    );
    if (form) {
      const [token, apr, lockDays, minStake, name, description] = form.split(',').map(s => s.trim());
      createPool(token, parseFloat(apr) * 100, parseInt(lockDays), ethers.utils.parseEther(minStake), name, description);
    }
  };

  const createPool = async (token: string, apr: number, lockDays: number, minStake: string, name: string, description: string) => {
    if (!factory) return;
    try {
      const createFee = await factory.CREATE_FEE();
      const tx = await factory.createPool(token, apr, lockDays, minStake, name, description, {
        value: createFee,
        from: account,
      });
      await tx.wait();
      toast({ title: 'Success', description: 'Pool created!', status: 'success', duration: 5000 });
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, status: 'error', duration: 5000 });
    }
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="lg" mb={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6} color="green.500">
        Create Pool
      </Heading>
      <FormControl>
        <FormLabel>Token Address</FormLabel>
        <Input value={tokenAddress} onChange={handleTokenChange} placeholder="ERC20 Token Address" />
        <Box mt={2} color="gray.400">{tokenInfo}</Box>
        <Button
          mt={4}
          bgGradient="linear(to-r, green.500, green.300)"
          color="white"
          onClick={openCreateModal}
        >
          Create Pool
        </Button>
      </FormControl>
    </Box>
  );
};

export default CreatePool;
