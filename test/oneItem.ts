export default function (): void {
  it("Create item", async function (): Promise<void> {
    await this.marketPlace.createItem(
      "https://gateway.pinata.cloud/ipfs/QmSLKSvWrc9Ma3119LsRxA8Pcj9Sm2jcMn7QWnAxfpVBqe",
      this.owner.address
    );
  });
}
