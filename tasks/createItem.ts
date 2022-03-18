import { task } from "hardhat/config";
import { formatEther } from "ethers/lib/utils";

import "@nomiclabs/hardhat-ethers";

interface IArgs {
  contract: string;
  tokenuri: string;
}

task("createitem", "Create market place item")
  .addParam("contract", "Contract address")
  .addParam("tokenuri", "Token URI")
  .setAction(async (args: IArgs, hre) => {
    const MarketPlace = await hre.ethers.getContractAt(
      "MarketPlace",
      args.contract
    );

    const [owner] = await hre.ethers.getSigners();

    const tx = await MarketPlace.createItem(args.tokenuri, owner.address);
    await tx.wait();

    console.log(`Successfully create item. Item id - ${tx}`);
  });

export {};
