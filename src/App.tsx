import { ChakraProvider, Box, Heading, Text, Button } from '@chakra-ui/react';
import { useWeb3 } from './hooks/useWeb3';
import Analytics from './components/Analytics';
import CreatePool from './components/CreatePool';
import InteractPool from './components/InteractPool';
import RewardCalculator from './components/RewardCalculator';
import PoolList from './components/PoolList';
import VerifyContract from './components/VerifyContract';

function App() {
  const { account, connectWallet, disconnectWallet } = useWeb3();

  return (
    <ChakraProvider>
      <Box maxW="1200px" mx="auto" p={8} color="white" bg="black" minH="100vh">
        <Box textAlign="center" mb={10}>
          <img
            src="https://photos.pinksale.finance/file/pinksale-logo-upload/1759847695513-f915ce15471ce09f03d8fbf68bc0616f.png"
            alt="VinuChain Staking Hub Logo"
            width="160"
          />
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '3xl' }}
            bgGradient="linear(to-r, white, green.500)"
            bgClip="text"
            my={4}
          >
            VinuChain Staking Hub
          </Heading>
          <Text fontSize="lg">
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
          </Text>
          <Button
            bgGradient="linear(to-r, green.500, green.300)"
            color="white"
            mt={4}
            size="lg"
            _hover={{ bgGradient: 'linear(to-r, green.600, green.400)' }}
            onClick={account ? disconnectWallet : connectWallet}
          >
            {account ? 'Disconnect Wallet' : 'Connect Wallet'}
          </Button>
        </Box>

        <Analytics />
        <CreatePool />
        <InteractPool />
        <RewardCalculator />
        <PoolList />
        <VerifyContract />
      </Box>
    </ChakraProvider>
  );
}

export default App;
