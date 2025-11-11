require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  solidity: '0.8.0',
  networks: {
    vinuchain: {
      url: 'https://rpc.vinuchain.org',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
