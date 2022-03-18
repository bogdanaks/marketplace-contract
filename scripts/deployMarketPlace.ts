import { ethers } from "hardhat";

const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const TOKEN_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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
