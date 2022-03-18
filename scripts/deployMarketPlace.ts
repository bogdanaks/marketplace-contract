import { ethers } from "hardhat";

const NFT_ADDRESS = "0x61E487526792df2AD5b6D20d06059Dd0A13f74C2"; // rinkeby
const TOKEN_ADDRESS = "0x3b89bd9fCE465dc976Ab3308fAbb57B8BaB4429D"; // rinkeby

async function main() {
  const MarketPlaceContract = await ethers.getContractFactory("MarketPlace");
  const marketPlace = await MarketPlaceContract.deploy(
    NFT_ADDRESS,
    TOKEN_ADDRESS
  );
  const [owner] = await ethers.getSigners();

  console.log("Marketplace deployed to:", marketPlace.address);
  console.log("Owner address is: ", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
