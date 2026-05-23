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
    mapping(address => bool) public authorizedCallers;

    event AgentRegistered(uint256 indexed tokenId, address indexed owner, string name);
    event ReputationUpdated(uint256 indexed tokenId, uint256 newScore);

    constructor() ERC721("Arc Agent Identity", "ARCID") Ownable(msg.sender) {}

    function setAuthorizedCaller(address caller, bool status) external onlyOwner {
        authorizedCallers[caller] = status;
    }

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
        require(authorizedCallers[msg.sender] || msg.sender == owner(), "Not authorized");
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

    /**
     * @notice Soulbound Implementation: Disable transfers to maintain identity integrity
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: Transfers disabled");
        }
        return super._update(to, tokenId, auth);
    }
}
