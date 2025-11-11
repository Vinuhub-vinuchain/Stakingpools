const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('StakingFactory', () => {
  let StakingFactory, factory, token, owner, user;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('MockToken');
    token = await Token.deploy();
    await token.deployed();
    StakingFactory = await ethers.getContractFactory('StakingFactory');
    factory = await StakingFactory.deploy(owner.address);
    await factory.deployed();
  });

  it('creates a pool', async () => {
    const tx = await factory.connect(user).createPool(
      token.address,
      1000,
      30,
      ethers.utils.parseEther('100'),
      'Test Pool',
      'Description',
      { value: ethers.utils.parseEther('0.01') }
    );
    const receipt = await tx.wait();
    const poolAddress = receipt.events.find(e => e.event === 'PoolCreated').args.poolAddress;
    expect(await factory.getAllPools()).to.include(poolAddress);
  });
});
