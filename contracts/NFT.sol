//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("CRYPTON", "CRYP") public {}

    function createNFT(address _account, string memory _tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_account, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }

    function transferNFT(address _from, address _to, uint256 _tokenId) public {
        _transfer(_from, _to, _tokenId);
    }
}
