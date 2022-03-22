//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./NFT.sol";
import "./Token.sol";
import "./IToken.sol";
import "./INFT.sol";

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
        address owner;
        uint256 price;
        uint256 createdAt;
    }

    mapping(uint256 => Order) public orders;
    mapping(uint256 => Bid[]) public bids;

    INFT public nftAddress;
    IToken public tokenAddress;

    constructor(address _nftAddress, address _tokenAddress) public {
        nftAddress = INFT(_nftAddress);
        tokenAddress = IToken(_tokenAddress);
    }

    modifier onlyOrderByType(uint256 _tokenId, OrderType _orderType) {
        require(orders[_tokenId].orderType == _orderType, "Invalid order type");
        _;
    }

    function createItem(string memory _tokenURI, address _owner) public returns (uint256 nftId) {
        emit CreateItem(_tokenURI, _owner);

        return nftAddress.createNFT(_owner, _tokenURI);
    }

    function listItem(uint256 _tokenId, uint256 _price) public {
        require(orders[_tokenId].createdAt == 0, "Already exist");
        require(_price > 0, "Must be greater than zero");

        orders[_tokenId] = Order(OrderType.FIX_PRICE, OrderStatus.PENDING, msg.sender, _price, block.timestamp);
        nftAddress.transferNFT(msg.sender, address(this), _tokenId);
        emit ListItem(_tokenId, _price);
    }

    function buyItem(uint256 _tokenId) public payable onlyOrderByType(_tokenId, OrderType.FIX_PRICE) {
        require(orders[_tokenId].createdAt != 0, "Not exist");
        require(msg.value >= orders[_tokenId].price, "Must be greater than price");

        orders[_tokenId].status = OrderStatus.FINISHED;
        tokenAddress.transferFrom(msg.sender, address(this), orders[_tokenId].price);
        nftAddress.transferNFT(address(this), msg.sender, _tokenId);
        emit BuyItem(_tokenId);
    }

    function cancel(uint256 _tokenId) public onlyOrderByType(_tokenId, OrderType.FIX_PRICE) {
        require(orders[_tokenId].createdAt != 0, "Not exist");
        require(orders[_tokenId].owner == msg.sender, "Only owner");
        require(orders[_tokenId].status == OrderStatus.PENDING, "Bids already placed or order finished");

        orders[_tokenId].status = OrderStatus.FINISHED;
        nftAddress.transferNFT(address(this), msg.sender, _tokenId);
        emit Cancel(_tokenId);
    }

    function listItemOnAuction(uint256 _tokenId, uint256 _minPrice) public {
        require(orders[_tokenId].createdAt == 0, "Already exist");

        orders[_tokenId] = Order(OrderType.AUCTION, OrderStatus.PENDING, msg.sender, _minPrice, block.timestamp);
        nftAddress.transferNFT(msg.sender, address(this), _tokenId);
        emit ListItemOnAuction(_tokenId, _minPrice);
    }

    function makeBid(uint256 _tokenId, uint256 _price) public onlyOrderByType(_tokenId, OrderType.AUCTION) {
        Bid memory lastBid;
        bool isFirstBid;

        if (bids[_tokenId].length > 0) {
            lastBid = bids[_tokenId][bids[_tokenId].length - 1];
            require(lastBid.amount < _price, "Bid amount must be greater than last bid");
            isFirstBid = false;
        } else {
            isFirstBid = true;
            lastBid = Bid(_price, msg.sender, block.timestamp);
        }

        orders[_tokenId].status = OrderStatus.RUNNING;
        bids[_tokenId].push(Bid(_price, msg.sender, block.timestamp));
        tokenAddress.transferFrom(msg.sender, address(this), _price);

        if (!isFirstBid) {
            tokenAddress.transfer(lastBid.bidder, lastBid.amount);
        }

        emit MakeBid(_tokenId, _price);
    }

    function finishAuction(uint256 _tokenId) public onlyOrderByType(_tokenId, OrderType.AUCTION) {
        require(orders[_tokenId].createdAt != 0, "Not exist");
        require(orders[_tokenId].status != OrderStatus.FINISHED, "Already finished");
        require(orders[_tokenId].createdAt + 3 days < block.timestamp, "It hasn't been three days");

        Bid memory lastBid = bids[_tokenId][bids[_tokenId].length - 1];
        orders[_tokenId].status = OrderStatus.FINISHED;

        if (bids[_tokenId].length >= 2) {
            nftAddress.transferNFT(address(this), lastBid.bidder, _tokenId);
            tokenAddress.transfer(orders[_tokenId].owner, lastBid.amount);
        } else {
            nftAddress.transferNFT(address(this), orders[_tokenId].owner, _tokenId);
            tokenAddress.transfer(lastBid.bidder, lastBid.amount);
        }
        emit FinishAuction(_tokenId);
    }

    event CreateItem(string _tokenURI, address indexed _owner);
    event ListItem(uint256 _tokenId, uint256 _price);
    event BuyItem(uint256 _tokenId);
    event Cancel(uint256 _tokenId);
    event ListItemOnAuction(uint256 _tokenId, uint256 _minPrice);
    event MakeBid(uint256 _tokenId, uint256 _price);
    event FinishAuction(uint256 _tokenId);
}
