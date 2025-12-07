// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CardGameNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    // Card metadata
    struct Card {
        uint256 tokenId;
        string name;
        string rarity; // common, rare, legendary
        uint256 power;
        uint256[] traits;
        string imageUri;
        address owner;
        uint256 mintedAt;
    }

    // Mapping from tokenId to Card
    mapping(uint256 => Card) public cards;

    // Mapping from address to array of tokenIds
    mapping(address => uint256[]) public playerCards;

    // Battle results tracking
    struct BattleResult {
        address winner;
        address loser;
        uint256 stake;
        uint256 timestamp;
    }

    BattleResult[] public battleHistory;

    // Player stats
    struct PlayerStats {
        address player;
        uint256 wins;
        uint256 losses;
        uint256 totalEarnings;
        uint256 cardsOwned;
        uint256 lastBattleAt;
    }

    mapping(address => PlayerStats) public playerStats;
    address[] public playerList;

    // Mint pricing
    uint256 public mintPrice = 0.01 ether;

    // Events
    event CardMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        string rarity,
        uint256 power
    );
    event BattleRecorded(
        address indexed winner,
        address indexed loser,
        uint256 stake,
        uint256 timestamp
    );
    event StatsUpdated(address indexed player, uint256 wins, uint256 losses);

    constructor() ERC721("CardGameNFT", "CGT") Ownable(msg.sender) {}

    // Mint a new card NFT
    function mintCard(
        string memory name,
        string memory rarity,
        uint256 power,
        uint256[] memory traits,
        string memory imageUri
    ) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(msg.sender, tokenId);

        Card memory newCard = Card({
            tokenId: tokenId,
            name: name,
            rarity: rarity,
            power: power,
            traits: traits,
            imageUri: imageUri,
            owner: msg.sender,
            mintedAt: block.timestamp
        });

        cards[tokenId] = newCard;
        playerCards[msg.sender].push(tokenId);

        // Update player stats if first time
        if (playerStats[msg.sender].cardsOwned == 0) {
            playerList.push(msg.sender);
        }
        playerStats[msg.sender].cardsOwned++;

        emit CardMinted(tokenId, msg.sender, name, rarity, power);

        return tokenId;
    }

    // Record battle result and update stats
    function recordBattle(
        address winner,
        address loser,
        uint256 stake
    ) public onlyOwner {
        require(winner != loser, "Winner and loser must be different");

        battleHistory.push(
            BattleResult({
                winner: winner,
                loser: loser,
                stake: stake,
                timestamp: block.timestamp
            })
        );

        playerStats[winner].wins++;
        playerStats[winner].totalEarnings += stake;
        playerStats[winner].lastBattleAt = block.timestamp;

        playerStats[loser].losses++;
        playerStats[loser].lastBattleAt = block.timestamp;

        emit BattleRecorded(winner, loser, stake, block.timestamp);
        emit StatsUpdated(winner, playerStats[winner].wins, playerStats[winner].losses);
        emit StatsUpdated(loser, playerStats[loser].wins, playerStats[loser].losses);
    }

    // Get player's cards
    function getPlayerCards(address player) public view returns (uint256[] memory) {
        return playerCards[player];
    }

    // Get card details
    function getCard(uint256 tokenId) public view returns (Card memory) {
        return cards[tokenId];
    }

    // Get player stats
    function getPlayerStats(address player) public view returns (PlayerStats memory) {
        return playerStats[player];
    }

    // Get leaderboard (top 10)
    function getLeaderboard() public view returns (PlayerStats[] memory) {
        uint256 length = playerList.length;
        PlayerStats[] memory leaderboard = new PlayerStats[](length);

        for (uint256 i = 0; i < length; i++) {
            leaderboard[i] = playerStats[playerList[i]];
        }

        // Bubble sort by wins
        for (uint256 i = 0; i < length; i++) {
            for (uint256 j = i + 1; j < length; j++) {
                if (leaderboard[j].wins > leaderboard[i].wins) {
                    PlayerStats memory temp = leaderboard[i];
                    leaderboard[i] = leaderboard[j];
                    leaderboard[j] = temp;
                }
            }
        }

        return leaderboard;
    }

    // Get battle history
    function getBattleHistory(uint256 limit) public view returns (BattleResult[] memory) {
        uint256 length = battleHistory.length;
        if (length == 0) return new BattleResult[](0);

        uint256 resultLength = limit < length ? limit : length;
        BattleResult[] memory result = new BattleResult[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = battleHistory[length - 1 - i];
        }

        return result;
    }

    // Withdraw contract balance
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Allow contract to receive ETH
    receive() external payable {}
}