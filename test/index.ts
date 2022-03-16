import { ethers } from "hardhat";
import errorsTest from "./errorsTest";
import oneItemTest from "./oneItem";

describe("Test functions", async function () {
  beforeEach(async function () {
    this.NFTContract = await ethers.getContractFactory("NFT");
    this.TokenContract = await ethers.getContractFactory("Token");
    this.MarketPlaceContract = await ethers.getContractFactory("MarketPlace");
    [this.owner, this.addr1] = await ethers.getSigners();

    this.nft = await this.NFTContract.deploy();
    this.token = await this.TokenContract.deploy();
    this.marketPlace = await this.MarketPlaceContract.deploy(
      this.nft.address,
      this.token.address
    );
  });

  errorsTest();
  oneItemTest();
});
