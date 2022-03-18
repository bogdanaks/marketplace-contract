import { ethers } from "hardhat";

async function main() {
  const NFTContract = await ethers.getContractFactory("NFT");
  const nft = await NFTContract.deploy();
  const [owner] = await ethers.getSigners();

  console.log("NFT deployed to:", nft.address);
  console.log("Owner address is: ", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
