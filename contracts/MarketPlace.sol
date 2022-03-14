//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { createNFT, transferNFT } from "./ERC721.sol";
import { transferFrom } from "./ERC20.sol";

contract MarketPlace is Ownable {
    enum OrderStatus {
        PENDING,
        RUNNING,
        FINISHED
    }

    struct Order {
        uint256 tokenId; 
        OrderStatus status;
        uint256 price;
        address owner;
        uint256 createdAt;
    }

    mapping(uint256 => Order) public orders;

    function createItem(string memory _tokenURI, address _owner) public {
        createNFT(_owner, _tokenURI);
        // TODO add event
    }

    function listItem(uint256 _tokenId, uint256 _price) public {
        require(orders[_tokenId], "Already exist");

        orders[_tokenId] = new Order(_tokenId, OrderStatus.PENDING, msg.sender, block.timestamp);
        transferNFT(msg.sender, address(this), _tokenId);
        // TODO add event
    }

    function buyItem(uint256 _tokenId) public {
        require(orders[_tokenId], "Not exist");
        require(msg.value >= orders[_tokenId].price, "Must be greater than price");

        orders[_tokenId].status = OrderStatus.FINISHED;
        transferFrom(msg.sender, address(this), orders[_tokenId].price);
        transferNFT(address(this), msg.sender, _tokenId);
        // TODO add event
    }

    function cancel(uint256 _tokenId) public {
        // TODO check owner
        require(orders[_tokenId], "Not exist");
        require(orders[_tokenId].status == OrderStatus.PENDING, "Bids already placed or order finished");

        orders[_tokenId].status = OrderStatus.FINISHED;
        transferNFT(address(this), msg.sender, _tokenId);
        // TODO add event
    }

    // function listItemOnAuction(uint256 _tokenId, uint256 _minPrice) public view returns (string memory) {
    //     return greeting;
    // }

    // function makeBid(uint256 _tokenId, uint256 _price) public view returns (string memory) {
    //     return greeting;
    // }

    // function finishAuction(uint256 _tokenId) public view returns (string memory) {
    //     return greeting;
    // }

    // function cancelAuction() public view returns (string memory) {
    //     return greeting;
    // }
}
