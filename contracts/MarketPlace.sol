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
    enum OrderType {
        FIX_PRICE,
        AUCTION
    }

    struct Bid {
        uint256 amount;
        address bidder;
        uint256 createdAt;
    }

    struct Order {
        OrderType orderType;
        OrderStatus status;
        uint256 price;
        address owner;
        uint256 createdAt;
    }

    mapping(uint256 => Order) public orders;
    mapping(uint256 => Bid[]) public bids;

    modifier onlyOrderByType(uint256 _tokenId, OrderType _orderType) {
        require(orders[_tokenId].orderType == _orderType, "Invalid order type");
        _;
    }

    function createItem(string memory _tokenURI, address _owner) public {
        createNFT(_owner, _tokenURI);
        // TODO add event
    }

    function listItem(uint256 _tokenId, uint256 _price) public {
        require(orders[_tokenId], "Already exist");

        orders[_tokenId] = new Order(OrderType.FIX_PRICE, OrderStatus.PENDING, _price, msg.sender, block.timestamp);
        transferNFT(msg.sender, address(this), _tokenId);
        // TODO add event
    }

    function buyItem(uint256 _tokenId) public onlyOrderByType(_tokenId, OrderType.FIX_PRICE) {
        require(orders[_tokenId], "Not exist");
        require(msg.value >= orders[_tokenId].price, "Must be greater than price");

        orders[_tokenId].status = OrderStatus.FINISHED;
        transferFrom(msg.sender, address(this), orders[_tokenId].price);
        transferNFT(address(this), msg.sender, _tokenId);
        // TODO add event
    }

    function cancel(uint256 _tokenId) public onlyOrderByType(_tokenId, OrderType.FIX_PRICE) {
        // TODO check owner
        require(orders[_tokenId], "Not exist");
        require(orders[_tokenId].status == OrderStatus.PENDING, "Bids already placed or order finished");

        orders[_tokenId].status = OrderStatus.FINISHED;
        transferNFT(address(this), msg.sender, _tokenId);
        // TODO add event
    }

    function listItemOnAuction(uint256 _tokenId, uint256 _minPrice) public {
        require(orders[_tokenId], "Already exist");

        orders[_tokenId] = new Order(OrderType.AUCTION, OrderStatus.PENDING, _minPrice, msg.sender, block.timestamp);
        transferNFT(msg.sender, address(this), _tokenId);
        // TODO add event
    }

    function makeBid(uint256 _tokenId, uint256 _price) public onlyOrderByType(_tokenId, OrderType.AUCTION) {
        uint256 lastBid = bids[_tokenId][bids[_tokenId].length - 1];
        require(lastBid.amount < _price, "Bid amount must be greater than last bid");

        bids[_tokenId].push = new Bid(_price, msg.sender, block.timestamp);
        transferFrom(address(this), lastBid.bidder, lastBid.amount);
        transferFrom(msg.sender, address(this), _price);
        // TODO add event
    }

    function finishAuction(uint256 _tokenId) public onlyOrderByType(_tokenId, OrderType.AUCTION) {
        require(orders[_tokenId], "Not exist");
        require(bids[_tokenId].length < 2, "Only if there are more than two bids");
        require(orders[_tokenId].status != OrderStatus.FINISHED, "Already finished");
        require(orders[_tokenId].createdAt + 3 days < block.timestamp, "It hasn't been three days");

        orders[_tokenId].status = OrderStatus.FINISHED;
        transferNFT(address(this), bids[_tokenId][bids[_tokenId].length - 1].bidder, _tokenId);
        transferFrom(address(this), lastBid.bidder, lastBid.amount);
        // TODO add event
    }
}
