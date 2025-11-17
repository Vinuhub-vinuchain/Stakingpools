import { useState } from 'react';
import {
  Box,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';

const CreatePool: React.FC = () => {
  const { factory, account } = useContract();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [form, setForm] = useState({
    tokenAddress: '',
    apr: '',
    lockDays: '',
    minStake: '',
    name: '',
    description: '',
  });

  const [tokenInfo, setTokenInfo] = useState('');

  const handleTokenChange = async (value: string) => {
    setForm(prev => ({ ...prev, tokenAddress: value }));
    if (ethers.utils.isAddress(value) && factory) {
      try {
        const token = new ethers.Contract(value, erc20ABI, factory.signer);
        const [symbol, decimals] = await Promise.all([
          token.symbol(),
          token.decimals(),
        ]);
        setTokenInfo(`${symbol} • ${decimals} decimals`);
      } catch {
        setTokenInfo('Invalid token address');
      }
    } else {
      setTokenInfo('');
    }
  };

  const handleCreate = async () => {
    if (!factory || !account) {
      toast({ title: "Wallet not connected", status: "error", duration: 4000 });
      return;
    }

    try {
      const createFee = await factory.CREATE_FEE();
      const aprInBasisPoints = Math.round(parseFloat(form.apr) * 100);
      const minStakeWei = ethers.utils.parseEther(form.minStake || "0");

      const tx = await factory.createPool(
        form.tokenAddress,
        aprInBasisPoints,
        parseInt(form.lockDays),
        minStakeWei,
        form.name,
        form.description,
        { value: createFee }
      );

      toast({ title: "Transaction sent...", description: tx.hash, status: "info", duration: null });

      await tx.wait();

      toast({ title: "Pool Created Successfully!", status: "success", duration: 6000 });
      onClose();
      setForm({
        tokenAddress: '',
        apr: '',
        lockDays: '',
        minStake: '',
        name: '',
        description: '',
      });
      setTokenInfo('');
    } catch (err: any) {
      toast({
        title: "Failed to create pool",
        description: err?.reason || err?.message || "Unknown error",
        status: "error",
        duration: 8000,
      });
    }
  };

  return (
    <Box bg="gray.800" p={8} borderRadius="xl" boxShadow="dark-lg">
      <Heading as="h2" size="lg" mb={6} color="green.400">
        Create New Staking Pool
      </Heading>

      <FormControl mb={4}>
        <FormLabel>Token Address</FormLabel>
        <Input
          value={form.tokenAddress}
          onChange={(e) => handleTokenChange(e.target.value)}
          placeholder="0x..."
          size="lg"
        />
        {tokenInfo && (
          <Text mt={2} fontSize="sm" color={tokenInfo.includes('Invalid') ? 'red.400' : 'green.400'}>
            {tokenInfo}
          </Text>
        )}
      </FormControl>

      <Button
        size="lg"
        w="full"
        colorScheme="green"
        onClick={onOpen}
        isDisabled={!ethers.utils.isAddress(form.tokenAddress) || tokenInfo.includes('Invalid')}
      >
        Create Pool
      </Button>

      {/* Beautiful Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>Create Staking Pool</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>APR (%)</FormLabel>
                <Input
                  placeholder="10.5"
                  value={form.apr}
                  onChange={(e) => setForm(prev => ({ ...prev, apr: e.target.value }))}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Lock Period (days)</FormLabel>
                <Input
                  type="number"
                  placeholder="30"
                  value={form.lockDays}
                  onChange={(e) => setForm(prev => ({ ...prev, lockDays: e.target.value }))}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Minimum Stake</FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="100"
                    value={form.minStake}
                    onChange={(e) => setForm(prev => ({ ...prev, minStake: e.target.value }))}
                  />
                  <InputRightElement children={<Text mr={3}>tokens</Text>} />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Pool Name</FormLabel>
                <Input
                  placeholder="VINU Staking Pool"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description (optional)</FormLabel>
                <Input
                  placeholder="High-yield VINU staking with 30-day lock"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </FormControl>

              <Text fontSize="sm" color="gray.400" textAlign="center">
                Creation fee: 0.01 VC (sent to protocol)
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleCreate}
              isDisabled={
                !form.apr ||
                !form.lockDays ||
                !form.minStake ||
                !form.name ||
                parseFloat(form.minStake) <= 0
              }
            >
              Create Pool
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreatePool;
