// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ArcAgentIdentity (ERC-8004 inspired)
 * @notice Manages on-chain identity and reputation for AI Agents and Service Providers on ARC.
 */
contract ArcAgentIdentity is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct AgentProfile {
        string name;
        uint256 reputationScore;
        uint256 totalJobsCompleted;
        bool isActive;
    }

    mapping(uint256 => AgentProfile) public agentProfiles;
    mapping(address => uint256) public addressToId;

    event AgentRegistered(uint256 indexed tokenId, address indexed owner, string name);
    event ReputationUpdated(uint256 indexed tokenId, uint256 newScore);

    constructor() ERC721("Arc Agent Identity", "ARCID") Ownable(msg.sender) {}

    /**
     * @notice Register a new Agent/Provider
     */
    function registerAgent(string memory name, string memory metadataUri) external returns (uint256) {
        require(addressToId[msg.sender] == 0, "Address already registered");

        uint256 tokenId = ++_nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataUri);

        agentProfiles[tokenId] = AgentProfile({
            name: name,
            reputationScore: 0,
            totalJobsCompleted: 0,
            isActive: true
        });

        addressToId[msg.sender] = tokenId;

        emit AgentRegistered(tokenId, msg.sender, name);
        return tokenId;
    }

    /**
     * @notice Update agent reputation (only callable by authorized ledger/owner)
     */
    function updateReputation(address agentAddress, int256 adjustment) external {
        // In a real app, we'd check if msg.sender is the authorized Ledger contract
        uint256 tokenId = addressToId[agentAddress];
        require(tokenId != 0, "Agent not registered");

        AgentProfile storage profile = agentProfiles[tokenId];
        if (adjustment > 0) {
            profile.reputationScore += uint256(adjustment);
            profile.totalJobsCompleted += 1;
        } else if (adjustment < 0 && profile.reputationScore >= uint256(-adjustment)) {
            profile.reputationScore -= uint256(-adjustment);
        }

        emit ReputationUpdated(tokenId, profile.reputationScore);
    }

    function getAgentProfile(address agentAddress) external view returns (AgentProfile memory) {
        uint256 tokenId = addressToId[agentAddress];
        require(tokenId != 0, "Agent not registered");
        return agentProfiles[tokenId];
    }
}
