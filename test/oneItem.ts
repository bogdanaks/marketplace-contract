import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";

import { ORDER_TYPE, ORDER_STATUS } from "./../types/enums";

export default function (): void {
  it("Create item", async function (): Promise<void> {
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
  });

  it("List item", async function (): Promise<void> {
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.listItem(1, parseEther("10"));

    const item = await this.marketPlace.orders(1);
    expect(item.owner).to.equal(this.owner.address);
    expect(item.orderType).to.equal(ORDER_TYPE.FIX_PRICE);
    expect(item.status).to.equal(ORDER_STATUS.PENDING);
  });

  it("Buy item", async function (): Promise<void> {
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.listItem(1, parseEther("10"));

    await this.marketPlace.buyItem(1, {
      value: parseEther("11"),
    });

    const item = await this.marketPlace.orders(1);
    expect(item.status).to.equal(ORDER_STATUS.FINISHED);
  });

  it("Cancel item", async function (): Promise<void> {
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.listItem(1, parseEther("10"));
    await this.marketPlace.cancel(1);

    const item = await this.marketPlace.orders(1);
    expect(item.status).to.equal(ORDER_STATUS.FINISHED);
  });
}
