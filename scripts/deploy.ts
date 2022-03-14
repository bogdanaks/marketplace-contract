import { ethers } from "hardhat";

async function main() {
  const MarketPlaceContract = await ethers.getContractFactory("MarketPlace");
  const marketPlace = await MarketPlaceContract.deploy();
  const [owner] = await ethers.getSigners();

  console.log("Marketplace deployed to:", marketPlace.address);
  console.log("Owner address is: ", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
