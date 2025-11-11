import { useState, useEffect } from 'react';
import { Box, Heading, Input, List, ListItem, Text, Button } from '@chakra-ui/react';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';

const PoolList: React.FC = () => {
  const { factory } = useContract();
  const [pools, setPools] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadPools = async () => {
      if (!factory) return;
      try {
        const allPools = await factory.getAllPools();
        const poolData = await Promise.all(
          allPools.map(async (addr: string) => {
            const pool = new ethers.Contract(addr, [
              'function stakeToken() view returns (address)',
              'function totalStaked() view returns (uint256)',
              'function totalStakers() view returns (uint256)',
              'function paused() view returns (bool)',
            ], factory.signer);
            const info = await factory.getPoolInfo(addr);
            const token = new ethers.Contract(info.stakeToken, [
              'function symbol() view returns (string)',
            ], factory.signer);
            return {
              address: addr,
              name: info.name,
              symbol: await token.symbol().catch(() => '???'),
              apr: info.apr / 100,
              minStake: ethers.utils.formatEther(info.minStake),
              tvl: ethers.utils.formatEther(await pool.totalStaked()),
              stakers: await pool.totalStakers(),
              paused: await pool.paused(),
            };
          })
        );
        setPools(poolData);
      } catch (error) {
        console.error('Failed to load pools:', error);
      }
    };
    loadPools();
  }, [factory]);

  const filteredPools = pools.filter((pool) =>
    pool.name.toLowerCase().includes(search.toLowerCase()) ||
    pool.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box bg="gray.800" p={6} borderRadius="lg" mb={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6} color="green.500">
        Explore & Stake Pools
      </Heading>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Pools"
        mb={4}
      />
      <List>
        {filteredPools.map((pool) => (
          <ListItem
            key={pool.address}
            bg="gray.700"
            p={4}
            borderRadius="md"
            mb={2}
            display="flex"
            justifyContent="space-between"
            cursor="pointer"
            _hover={{ bg: 'gray.600' }}
            onClick={() => document.getElementById('poolAddress')?.setAttribute('value', pool.address)}
          >
            <Text>
              {pool.name} ({pool.symbol}) | APR: {pool.apr}% | Min: {pool.minStake}
            </Text>
            <Text>TVL: {pool.tvl} | Stakers: {pool.stakers} | {pool.paused ? 'Paused' : 'Active'}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PoolList;
