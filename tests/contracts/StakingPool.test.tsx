// tests/contracts/StakingFactory.test.ts
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe("StakingFactory", function () {
  it("Should create a pool and emit event", async function () {
    const [deployer, user] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("StakingFactory");
    const factory = await Factory.deploy(deployer.address);
    await factory.waitForDeployment();

    const MockToken = await ethers.getContractFactory("MockERC20");
    const token = await MockToken.deploy();
    await token.waitForDeployment();

    const fee = await factory.CREATE_FEE();

    const tx = await factory.connect(user).createPool(
      await token.getAddress(),
      1000, // 10%
      30,
      ethers.parseEther("100"),
      "Test Pool",
      "Description",
      { value: fee }
    );

    await expect(tx)
      .to.emit(factory, "PoolCreated")
      .withArgs(
        await (await tx.wait())?.logs[0]?.args?.poolAddress,
        user.address,
        await token.getAddress(),
        1000,
        30,
        ethers.parseEther("100"),
        "Test Pool"
      );

    const pools = await factory.getAllPools();
    expect(pools.length).to.equal(1);
  });
});
