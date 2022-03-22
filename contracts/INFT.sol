//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

interface INFT {
  function createNFT(address _account, string memory _tokenURI) external returns (uint256);
  function transferNFT(address _from, address _to, uint256 _tokenId) external;
}