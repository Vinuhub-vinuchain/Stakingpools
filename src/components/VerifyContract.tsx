import { Box, Heading, Textarea, Button, Text, List, ListItem } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}

contract StakingPool is Context {
    address public stakeToken;
    address public creator;
    uint256 public apr;
    uint256 public lockDays;
    uint256 public minStake;
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public lastStakedTime;
    uint256 public totalStaked;
    uint256 public totalStakers;
    bool public paused;

    constructor(address _stakeToken, uint256 _apr, uint256 _lockDays, uint256 _minStake, address _creator) {
        stakeToken = _stakeToken;
        apr = _apr;
        lockDays = _lockDays;
        minStake = _minStake;
        creator = _creator;
    }

    function stake(uint256 amount) external {
        require(!paused, "Pool is paused");
        require(amount >= minStake, "Below minimum stake");
        IERC20(stakeToken).transferFrom(_msgSender(), address(this), amount);
        stakedBalance[_msgSender()] += amount;
        lastStakedTime[_msgSender()] = block.timestamp;
        totalStaked += amount;
        if (stakedBalance[_msgSender()] == amount) totalStakers += 1;
    }

    function unstake() external {
        require(!paused, "Pool is paused");
        require(stakedBalance[_msgSender()] > 0, "No stake");
        require(block.timestamp >= lastStakedTime[_msgSender()] + lockDays * 1 days, "Lock period not over");
        uint256 amount = stakedBalance[_msgSender()];
        stakedBalance[_msgSender()] = 0;
        totalStaked -= amount;
        totalStakers -= 1;
        IERC20(stakeToken).transfer(_msgSender(), amount);
    }

    function getPendingRewards(address user) external view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastStakedTime[user];
        return (stakedBalance[user] * apr * timeElapsed) / (365 * 1 days * 100);
    }

    function claimRewards() external {
        require(!paused, "Pool is paused");
        uint256 rewards = this.getPendingRewards(_msgSender());
        require(rewards > 0, "No rewards");
        lastStakedTime[_msgSender()] = block.timestamp;
        IERC20(stakeToken).transfer(_msgSender(), rewards);
    }

    function pause(bool _status) external {
        require(_msgSender() == creator, "Not creator");
        paused = _status;
    }
}`;

const VerifyContract: React.FC = () => {
  const toast = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(contractCode).then(() => {
      toast({ title: 'Success', description: 'Code copied!', status: 'success', duration: 5000 });
    }).catch(() => {
      toast({ title: 'Error', description: 'Failed to copy', status: 'error', duration: 5000 });
    });
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="lg" mb={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6} color="green.500">
        Verify Your Pool Contract
      </Heading>
      <Text mb={4}>
        Copy the Solidity code below and use it to verify your pool contract on{' '}
        <a href="https://explorer.vinuchain.org" target="_blank" rel="noopener noreferrer" style={{ color: '#4CAF50' }}>
          VinuChain Explorer
        </a>.
      </Text>
      <Textarea value={contractCode} isReadOnly minH="400px" bg="gray.700" color="white" />
      <Button
        mt={4}
        bgGradient="linear(to-r, green.500, green.300)"
        color="white"
        onClick={copyCode}
      >
        Copy Contract Code
      </Button>
      <Heading as="h3" size="md" mt={6} mb={4}>
        How to Verify
      </Heading>
      <List styleType="decimal" spacing={2}>
        <ListItem>
          Go to <a href="https://explorer.vinuchain.org" target="_blank" rel="noopener noreferrer" style={{ color: '#4CAF50' }}>
            VinuChain Explorer
          </a> and search your pool address.
        </ListItem>
        <ListItem>Click "Verify & Publish" → "Single File".</ListItem>
        <ListItem>Paste the code above.</ListItem>
        <ListItem>
          Enter constructor arguments:
          <List styleType="disc" ml={6}>
            <ListItem><code>_stakeToken</code>: token address</ListItem>
            <ListItem><code>_apr</code>: APR in basis points (10% = 1000)</ListItem>
            <ListItem><code>_lockDays</code>: integer days</ListItem>
            <ListItem><code>_minStake</code>: min stake in wei</ListItem>
            <ListItem><code>_creator</code>: your wallet</ListItem>
          </List>
        </ListItem>
        <ListItem>Click "Verify".</ListItem>
      </List>
    </Box>
  );
};

export default VerifyContract;
