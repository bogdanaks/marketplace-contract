import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ORDER_TYPE, ORDER_STATUS } from "../types/enums";

export default function (): void {
  it("List item on auction", async function (): Promise<void> {
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.listItemOnAuction(1, parseEther("10"));

    const item = await this.marketPlace.orders(1);
    expect(item.owner).to.equal(this.owner.address);
    expect(item.orderType).to.equal(ORDER_TYPE.AUCTION);
    expect(item.status).to.equal(ORDER_STATUS.PENDING);
  });

  it("Make bid", async function (): Promise<void> {
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.listItemOnAuction(1, parseEther("10"));
    await this.marketPlace.makeBid(1, parseEther("10"));

    const order = await this.marketPlace.orders(1);
    expect(order.owner).to.equal(this.owner.address);
    expect(order.orderType).to.equal(ORDER_TYPE.AUCTION);
    expect(order.status).to.equal(ORDER_STATUS.RUNNING);

    const lastBid = await this.marketPlace.bids(1, 0);
    expect(lastBid.bidder).to.equal(this.owner.address);
    expect(lastBid.amount).to.equal(parseEther("10"));
  });

  it("Finish auction", async function (): Promise<void> {
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.listItemOnAuction(1, parseEther("10"));
    await this.marketPlace.makeBid(1, parseEther("10"));
    await this.marketPlace.makeBid(1, parseEther("10.1"));
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3 + 1]); // 3d 1s
    await this.marketPlace.finishAuction(1);
  });
}
