// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./StakingPool.sol";

/**
 * @title StakingFactory
 * @dev Factory contract for creating staking pools.
 */
contract StakingFactory {
    uint256 public constant CREATE_FEE = 0.01 ether;
    address public feeWallet;
    address[] public pools;
    mapping(address => address[]) public userPools;
    mapping(address => PoolInfo) public poolInfo;

    struct PoolInfo {
        address poolAddress;
        address stakeToken;
        uint256 apr;
        uint256 lockDays;
        uint256 minStake;
        string name;
        string description;
    }

    event PoolCreated(
        address indexed poolAddress,
        address creator,
        address token,
        uint256 apr,
        uint256 lockDays,
        uint256 minStake,
        string name,
        string description
    );

    /**
     * @dev Initializes the factory with a fee wallet.
     * @param _feeWallet Address to receive pool creation fees.
     */
    constructor(address _feeWallet) {
        feeWallet = _feeWallet;
    }

    /**
     * @dev Creates a new staking pool.
     * @param stakeToken Address of the ERC20 token.
     * @param apr Annual percentage rate in basis points.
     * @param lockDays Number of lock days.
     * @param minStake Minimum stake amount in wei.
     * @param name Pool name.
     * @param description Pool description.
     */
    function createPool(
        address stakeToken,
        uint256 apr,
        uint256 lockDays,
        uint256 minStake,
        string memory name,
        string memory description
    ) external payable {
        require(msg.value >= CREATE_FEE, "Insufficient fee");
        StakingPool pool = new StakingPool(stakeToken, apr, lockDays, minStake, msg.sender);
        pools.push(address(pool));
        userPools[msg.sender].push(address(pool));
        poolInfo[address(pool)] = PoolInfo(address(pool), stakeToken, apr, lockDays, minStake, name, description);
        payable(feeWallet).transfer(msg.value);
        emit PoolCreated(address(pool), msg.sender, stakeToken, apr, lockDays, minStake, name, description);
    }

    /**
     * @dev Returns all pool addresses.
     * @return Array of pool addresses.
     */
    function getAllPools() external view returns (address[] memory) {
        return pools;
    }

    /**
     * @dev Returns pools created by a user.
     * @param user Address of the user.
     * @return Array of pool addresses.
     */
    function getUserPools(address user) external view returns (address[] memory) {
        return userPools[user];
    }

    /**
     * @dev Returns information about a pool.
     * @param poolAddress Address of the pool.
     * @return Pool information.
     */
    function getPoolInfo(address poolAddress) external view returns (PoolInfo memory) {
        return poolInfo[poolAddress];
    }
}
