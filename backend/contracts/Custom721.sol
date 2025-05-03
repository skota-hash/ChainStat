// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Custom721 is ERC721Enumerable, Ownable {
    using Strings for uint256;

    IERC20 public immutable yodaToken;

    struct PlayerStats {
        string playerName;
        uint256 matches;
        uint256 runs;
        uint256 wickets;
        uint256 fifties;
        uint256 centuries;
        uint256 strikeRate;
        string category;
        string role;
        string image;
        string date;
    }

    struct Pool {
        PlayerStats stats;
        uint256 price;
        uint256 minted;
        uint256 maxSupply;
    }

    mapping(uint256 => Pool) public pools;
    mapping(uint256 => uint256) public tokenToPoolId;

    uint256 public poolIdCounter = 1;

    event NFTMinted(uint256 indexed poolId, uint256 indexed tokenId, address indexed recipient);
    event PoolCreated(uint256 indexed poolId, string category, string player);
    event PlayerStatsUpdated(uint256 indexed poolId, string playerName, string category);

    constructor(address _yodaToken) ERC721("IPL Stats NFT", "IPL2025") Ownable(msg.sender) {
        require(_yodaToken != address(0), "Invalid YODA token address");
        yodaToken = IERC20(_yodaToken);
    }

    function createPool(PlayerStats memory stats, uint256 price, uint256 maxSupply) external onlyOwner {
        pools[poolIdCounter] = Pool(stats, price, 0, maxSupply);
        emit PoolCreated(poolIdCounter, stats.category, stats.playerName);
        poolIdCounter++;
    }

    function updatePlayerStats(uint256 poolId, PlayerStats memory stats) external onlyOwner {
        require(bytes(pools[poolId].stats.playerName).length > 0, "Pool does not exist");
        pools[poolId].stats = stats;
        emit PlayerStatsUpdated(poolId, stats.playerName, stats.category);
    }

    function mintFromAvailable(uint256 poolId, uint256 quantity) external {
        Pool storage pool = pools[poolId];
        require(bytes(pool.stats.playerName).length > 0, "Pool does not exist");
        require(pool.minted + quantity <= pool.maxSupply, "Max supply reached");

        uint256 totalPrice = pool.price * quantity;
        require(yodaToken.transferFrom(msg.sender, owner(), totalPrice), "YODA payment failed");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 newTokenId = totalSupply() + 1;
            _safeMint(msg.sender, newTokenId);
            tokenToPoolId[newTokenId] = poolId;
            pool.minted += 1;
            emit NFTMinted(poolId, newTokenId, msg.sender);
        }
    }

    function getSupplyInfo(uint256 poolId) public view returns (uint256 minted, uint256 maxSupply, uint256 price) {
        Pool storage pool = pools[poolId];
        return (pool.minted, pool.maxSupply, pool.price);
    }

    // 🆕 Getter for PlayerStats directly
    function getPlayerStats(uint256 poolId) public view returns (
        string memory playerName,
        uint256 matches,
        uint256 runs,
        uint256 wickets,
        uint256 fifties,
        uint256 centuries,
        uint256 strikeRate,
        string memory category,
        string memory role,
        string memory image,
        string memory date
    ) {
        PlayerStats storage stats = pools[poolId].stats;
        return (
            stats.playerName,
            stats.matches,
            stats.runs,
            stats.wickets,
            stats.fifties,
            stats.centuries,
            stats.strikeRate,
            stats.category,
            stats.role,
            stats.image,
            stats.date
        );
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        Pool storage pool = pools[tokenToPoolId[tokenId]];
        PlayerStats memory stats = pool.stats;

        string memory attributes;
        if (keccak256(bytes(stats.role)) == keccak256(bytes("Batsman"))) {
            attributes = string(abi.encodePacked(
                '{"trait_type":"Player","value":"', stats.playerName, '"},',
                '{"trait_type":"Matches","value":"', stats.matches.toString(), '"},',
                '{"trait_type":"Runs","value":"', stats.runs.toString(), '"},',
                '{"trait_type":"Fifties","value":"', stats.fifties.toString(), '"},',
                '{"trait_type":"Centuries","value":"', stats.centuries.toString(), '"},',
                '{"trait_type":"Strike Rate","value":"', stats.strikeRate.toString(), '"}'
            ));
        } else {
            attributes = string(abi.encodePacked(
                '{"trait_type":"Player","value":"', stats.playerName, '"},',
                '{"trait_type":"Matches","value":"', stats.matches.toString(), '"},',
                '{"trait_type":"Wickets","value":"', stats.wickets.toString(), '"}'
            ));
        }

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{',
                '"name":"', stats.category, '",',
                '"description":"Top ', stats.category, ' ', stats.role, ' as of ', stats.date, '",',
                '"image":"', stats.image, '",',
                '"attributes":[', attributes, ']',
            '}'
        ))));

        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}
