import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import { ethers } from "hardhat";

export default function (): void {
  it("Error: Invalid order type", async function (): Promise<void> {
    const errorMsg = "Invalid order type";
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );

    await this.marketPlace.listItem(1, parseEther("10"));
    await expect(
      this.marketPlace.makeBid(1, parseEther("1"))
    ).to.be.revertedWith(errorMsg);
    await expect(this.marketPlace.finishAuction(1)).to.be.revertedWith(
      errorMsg
    );

    await this.marketPlace.listItemOnAuction(2, parseEther("10"));
    await expect(
      this.marketPlace.buyItem(2, {
        value: parseEther("11"),
      })
    ).to.be.revertedWith(errorMsg);
    await expect(this.marketPlace.cancel(2)).to.be.revertedWith(errorMsg);
    await expect(this.marketPlace.cancel(2)).to.be.revertedWith(errorMsg);
  });

  it("Error: Already exist", async function (): Promise<void> {
    const errorMsg = "Already exist";
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    this.marketPlace.listItem(1, parseEther("1"));
    await expect(
      this.marketPlace.listItem(1, parseEther("1"))
    ).to.be.revertedWith(errorMsg);

    await this.marketPlace.listItemOnAuction(2, parseEther("10"));
    await expect(
      this.marketPlace.listItemOnAuction(2, parseEther("1"))
    ).to.be.revertedWith(errorMsg);
  });

  it("Error: Must be greater than zero", async function (): Promise<void> {
    const errorMsg = "Must be greater than zero";
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await expect(
      this.marketPlace.listItem(1, parseEther("0"))
    ).to.be.revertedWith(errorMsg);
  });

  it("Error: Not exist", async function (): Promise<void> {
    const errorMsg = "Not exist";
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await expect(
      this.marketPlace.buyItem(2, {
        value: parseEther("1"),
      })
    ).to.be.revertedWith(errorMsg);
    await expect(this.marketPlace.cancel(2)).to.be.revertedWith(errorMsg);
  });

  it("Error: Must be greater than price", async function (): Promise<void> {
    const errorMsg = "Must be greater than price";
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    this.marketPlace.listItem(1, parseEther("10"));
    await expect(
      this.marketPlace.buyItem(1, {
        value: parseEther("1"),
      })
    ).to.be.revertedWith(errorMsg);
  });

  it("Error: Bids already placed or order finished", async function (): Promise<void> {
    const errorMsg = "Bids already placed or order finished";
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    this.marketPlace.listItem(1, parseEther("10"));
    this.marketPlace.cancel(1);
    await expect(this.marketPlace.cancel(1)).to.be.revertedWith(errorMsg);
  });

  it("Error: Bid amount must be greater than last bid", async function (): Promise<void> {
    const errorMsg = "Bid amount must be greater than last bid";
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    this.marketPlace.listItemOnAuction(1, parseEther("10"));
    this.marketPlace.makeBid(1, parseEther("11"));
    await expect(
      this.marketPlace.makeBid(1, parseEther("5"))
    ).to.be.revertedWith(errorMsg);
  });

  it("Error: Already finished", async function (): Promise<void> {
    const errorMsg = "Already finished";
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.listItemOnAuction(1, parseEther("10"));
    await this.marketPlace.makeBid(1, parseEther("10"));
    await this.marketPlace.makeBid(1, parseEther("10.1"));
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 3 + 10]); // 3d 10s
    await this.marketPlace.finishAuction(1);
    await expect(this.marketPlace.finishAuction(1)).to.be.revertedWith(
      errorMsg
    );
  });

  it("Error: It hasn't been three days", async function (): Promise<void> {
    const errorMsg = "It hasn't been three days";
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.listItemOnAuction(1, parseEther("10"));
    await expect(this.marketPlace.finishAuction(1)).to.be.revertedWith(
      errorMsg
    );
  });

  it("Error: Only owner", async function (): Promise<void> {
    const errorMsg = "Only owner";
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
    await this.marketPlace.listItem(1, parseEther("10"));
    await expect(
      this.marketPlace.connect(this.addr1).cancel(1)
    ).to.be.revertedWith(errorMsg);
  });
}
