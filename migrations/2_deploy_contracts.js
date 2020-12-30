const busSafe = artifacts.require("busSafe");

module.exports = function (deployer) {
  deployer.deploy(busSafe);
};