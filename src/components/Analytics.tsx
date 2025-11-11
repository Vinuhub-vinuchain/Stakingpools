import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAnalytics } from '../hooks/useAnalytics';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics: React.FC = () => {
  const { totalTVL, averageAPR, totalStakers, userStaked, userRewards, chartData } = useAnalytics();

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: 'white' } } },
    scales: { y: { beginAtZero: true, ticks: { color: 'white' } }, x: { ticks: { color: 'white' } } },
  };

  const chartDataConfig = {
    labels: chartData.map((_, i) => `Pool ${i + 1}`),
    datasets: [
      {
        label: 'Staked Amount',
        data: chartData,
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="lg" mb={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6} color="green.500">
        Advanced Staking Analytics
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
        <Stat bg="gray.700" p={4} borderRadius="md">
          <StatLabel>Total TVL</StatLabel>
          <StatNumber>{totalTVL.toFixed(2)}</StatNumber>
        </Stat>
        <Stat bg="gray.700" p={4} borderRadius="md">
          <StatLabel>Average APR</StatLabel>
          <StatNumber>{averageAPR.toFixed(2)}%</StatNumber>
        </Stat>
        <Stat bg="gray.700" p={4} borderRadius="md">
          <StatLabel>Total Stakers</StatLabel>
          <StatNumber>{totalStakers}</StatNumber>
        </Stat>
        <Stat bg="gray.700" p={4} borderRadius="md">
          <StatLabel>Your Total Staked</StatLabel>
          <StatNumber>{userStaked.toFixed(2)}</StatNumber>
        </Stat>
        <Stat bg="gray.700" p={4} borderRadius="md">
          <StatLabel>Your Pending Rewards</StatLabel>
          <StatNumber>{userRewards.toFixed(2)}</StatNumber>
        </Stat>
      </SimpleGrid>
      <Box bg="gray.900" p={4} borderRadius="md">
        <Bar options={chartOptions} data={chartDataConfig} />
      </Box>
    </Box>
  );
};

export default Analytics;
