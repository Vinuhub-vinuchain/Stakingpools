import { useState, useEffect } from 'react';
import { Box, Heading, Input, List, ListItem, Text } from '@chakra-ui/react';
import { Contract, formatEther } from 'ethers';
import { useContract } from '../hooks/useContract';

const PoolList: React.FC = () => {
  const { factory } = useContract();
  const [pools, setPools] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadPools = async () => {
      if (!factory) return;

      try {
        const signer = await factory.getSigner(); 
        const allPools = await factory.getAllPools();

        const poolData = await Promise.all(
          allPools.map(async (addr: string) => {
            const pool = new Contract(addr, [
              'function stakeToken() view returns (address)',
              'function totalStaked() view returns (uint256)',
              'function totalStakers() view returns (uint256)',
              'function paused() view returns (bool)',
            ], signer);

            const info = await factory.getPoolInfo(addr);

            const token = new Contract(info.stakeToken, ['function symbol() view returns (string)'], signer);

            return {
              address: addr,
              name: info.name,
              symbol: await token.symbol().catch(() => '???'),
              apr: info.apr / 100,
              minStake: formatEther(info.minStake),
              tvl: formatEther(await pool.totalStaked()),
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
            <Text>
              TVL: {pool.tvl} | Stakers: {pool.stakers} | {pool.paused ? 'Paused' : 'Active'}
            </Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PoolList;
