import { useState } from 'react';
import { Box, Heading, Button, Input, FormControl, FormLabel, Text } from '@chakra-ui/react';

const RewardCalculator: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [apr, setApr] = useState('');
  const [days, setDays] = useState('');
  const [result, setResult] = useState(0);

  const calculate = () => {
    const rewards = (parseFloat(amount) * parseFloat(apr) * parseFloat(days)) / (365 * 100);
    setResult(isNaN(rewards) ? 0 : rewards);
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="lg" mb={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6} color="green.500">
        Reward Calculator
      </Heading>
      <FormControl>
        <FormLabel>Stake Amount</FormLabel>
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <FormLabel mt={4}>APR (%)</FormLabel>
        <Input type="number" value={apr} onChange={(e) => setApr(e.target.value)} placeholder="APR" />
        <FormLabel mt={4}>Days</FormLabel>
        <Input type="number" value={days} onChange={(e) => setDays(e.target.value)} placeholder="Days" />
        <Button
          mt={4}
          bgGradient="linear(to-r, green.500, green.300)"
          color="white"
          onClick={calculate}
        >
          Calculate
        </Button>
        <Text mt={4}>Estimated Rewards: {result.toFixed(6)}</Text>
      </FormControl>
    </Box>
  );
};

export default RewardCalculator;
