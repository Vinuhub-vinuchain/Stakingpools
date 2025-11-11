const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('StakingPool', () => {
  let StakingPool, pool, token, owner, user;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('MockToken');
    token = await Token.deploy();
    await token.deployed();
    StakingPool = await ethers.getContractFactory('StakingPool');
    pool = await StakingPool.deploy(token.address, 1000, 30, ethers.utils.parseEther('100'), owner.address);
    await pool.deployed();
  });

  it('allows staking', async () => {
    await token.transfer(user.address, ethers.utils.parseEther('1000'));
    await token.connect(user).approve(pool.address, ethers.utils.parseEther('100'));
    await pool.connect(user).stake(ethers.utils.parseEther('100'));
    expect(await pool.stakedBalance(user.address)).to.equal(ethers.utils.parseEther('100'));
  });

  it('prevents staking when paused', async () => {
    await pool.pause(true);
    await token.connect(user).approve(pool.address, ethers.utils.parseEther('100'));
    await expect(pool.connect(user).stake(ethers.utils.parseEther('100'))).to.be.revertedWith('Pool is paused');
  });
});
