import { ethers } from "hardhat";

async function main() {
  const TokenContract = await ethers.getContractFactory("Token");
  const token = await TokenContract.deploy();
  const [owner] = await ethers.getSigners();

  console.log("Token deployed to:", token.address);
  console.log("Owner address is: ", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
