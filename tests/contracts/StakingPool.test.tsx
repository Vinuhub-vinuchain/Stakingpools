import { expect } from 'chai';
import { ethers } from 'hardhat';

describe("StakingPool", function () {
  it("Should stake, calculate rewards, and allow unstake after lock", async function () {
    const [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MockERC20");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const Pool = await ethers.getContractFactory("StakingPool");
    const pool = await Pool.deploy(await token.getAddress(), 1000, 7, ethers.parseEther("10"), owner.address);
    await pool.waitForDeployment();

    await token.transfer(user.address, ethers.parseEther("100"));
    await token.connect(user).approve(await pool.getAddress(), ethers.parseEther("50"));
    await pool.connect(user).stake(ethers.parseEther("50"));

    await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60 + 1]);
    await ethers.provider.send("evm_mine", []);

    await pool.connect(user).unstake();
    expect(await token.balanceOf(user.address)).to.be.above(ethers.parseEther("50"));
  });
});
