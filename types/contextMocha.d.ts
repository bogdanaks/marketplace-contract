import {
  MarketPlace,
  MarketPlace__factory,
  NFT,
  NFT__factory,
  Token,
  Token__factory,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

declare module "mocha" {
  export interface Context {
    NFTContract: NFT__factory;
    TokenContract: Token__factory;
    MarketPlaceContract: MarketPlace__factory;
    nft: NFT;
    token: Token;
    marketPlace: MarketPlace;
    owner: SignerWithAddress;
    addr1: SignerWithAddress;
  }
}
