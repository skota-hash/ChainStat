// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is Ownable {

    struct Listing {
        address seller;
        uint256 price; // in YODA tokens
        uint256 timestamp; // added for tracking
    }

    IERC721 public nftContract;
    IERC20 public yodaToken;

    mapping(uint256 => Listing) public listings;
    uint256[] public activeListings; // store listed tokenIds

    event NFTListed(uint256 indexed tokenId, address seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address buyer, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId, address seller);

    constructor(address _nftContract, address _yodaToken) Ownable(msg.sender) {
        nftContract = IERC721(_nftContract);
        yodaToken = IERC20(_yodaToken);
    }

    function listNFT(uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than zero");
        require(nftContract.ownerOf(tokenId) == msg.sender, "You are not the owner");
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)) ||
            nftContract.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            timestamp: block.timestamp
        });

        activeListings.push(tokenId);

        emit NFTListed(tokenId, msg.sender, price);
    }

    function buyNFT(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.price > 0, "Not listed");

        require(
            yodaToken.transferFrom(msg.sender, listing.seller, listing.price),
            "YODA transfer failed"
        );

        nftContract.transferFrom(listing.seller, msg.sender, tokenId);

        _removeActiveListing(tokenId);
        delete listings[tokenId];

        emit NFTSold(tokenId, msg.sender, listing.price);
    }

    function cancelListing(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not seller");

        _removeActiveListing(tokenId);
        delete listings[tokenId];

        emit NFTUnlisted(tokenId, msg.sender);
    }

    function getListing(uint256 tokenId) public view returns (address seller, uint256 price, uint256 timestamp) {
        Listing memory listing = listings[tokenId];
        return (listing.seller, listing.price, listing.timestamp);
    }

    function getAllListings() public view returns (uint256[] memory, Listing[] memory) {
        uint256 total = activeListings.length;
        Listing[] memory allListings = new Listing[](total);

        for (uint256 i = 0; i < total; i++) {
            uint256 tokenId = activeListings[i];
            allListings[i] = listings[tokenId];
        }

        return (activeListings, allListings);
    }

    function _removeActiveListing(uint256 tokenId) internal {
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == tokenId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }
    }
}
