import { useState } from 'react';
import {
  Box, Button, Input, FormControl, FormLabel, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, ModalCloseButton, VStack, Text, useDisclosure, useToast
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';

export default function CreatePool() {
  const { factory, account } = useContract();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [form, setForm] = useState({
    token: '', apr: '', lockDays: '', minStake: '', name: '', desc: ''
  });

  const [tokenInfo, setTokenInfo] = useState('');

  const validateToken = async (addr: string) => {
    if (!ethers.isAddress(addr) || !factory) {
      setTokenInfo('Invalid address');
      return;
    }
    try {
      const token = new ethers.Contract(addr, ["function symbol() view returns (string)", "function decimals() view returns (uint8)"], factory.signer);
      const [symbol, decimals] = await Promise.all([token.symbol(), token.decimals()]);
      setTokenInfo(`${symbol} • ${decimals} decimals`);
    } catch {
      setTokenInfo('Invalid ERC20');
    }
  };

  const create = async () => {
    if (!factory || !account) return;
    try {
      const fee = await factory.CREATE_FEE();
      const tx = await factory.createPool(
        form.token,
        Math.round(parseFloat(form.apr) * 100),
        parseInt(form.lockDays),
        ethers.parseEther(form.minStake || "0"),
        form.name,
        form.desc,
        { value: fee }
      );
      toast({ title: "Creating pool...", status: "info" });
      await tx.wait();
      toast({ title: "Pool Created!", status: "success" });
      onClose();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message.split('(')[0], status: "error" });
    }
  };

  return (
    <Box p={8} bg="gray.800" rounded="xl" shadow="2xl">
      <Button w="full" size="lg" colorScheme="green" onClick={onOpen}>
        Create New Staking Pool
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>Create Staking Pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Token Address</FormLabel>
                <Input value={form.token} onChange={(e) => {
                  setForm({ ...form, token: e.target.value });
                  validateToken(e.target.value);
                }} />
                {tokenInfo && <Text fontSize="sm" mt={1} color={tokenInfo.includes('Invalid') ? "red.400" : "green.400"}>{tokenInfo}</Text>}
              </FormControl>

              <FormControl isRequired><FormLabel>APR (%)</FormLabel><Input value={form.apr} onChange={e => setForm({ ...form, apr: e.target.value })} placeholder="10.5" /></FormControl>
              <FormControl isRequired><FormLabel>Lock Period (days)</FormLabel><Input value={form.lockDays} onChange={e => setForm({ ...form, lockDays: e.target.value })} placeholder="30" /></FormControl>
              <FormControl isRequired><FormLabel>Minimum Stake</FormLabel><Input value={form.minStake} onChange={e => setForm({ ...form, minStake: e.target.value })} placeholder="100" /></FormControl>
              <FormControl isRequired><FormLabel>Pool Name</FormLabel><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormControl>
              <FormControl><FormLabel>Description</FormLabel><Input value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} /></FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={create} isDisabled={!form.token || !form.apr || !form.lockDays || !form.minStake || !form.name}>
              Create Pool (0.01 VC fee)
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
