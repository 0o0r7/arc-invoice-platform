// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IArcAgentIdentity {
    function updateReputation(address agentAddress, int256 adjustment) external;
}

/**
 * @title ArcAgenticLedger
 * @dev Implements ERC-8183 (Agentic Commerce) and ERC-8004 inspired reputation.
 * Purpose-built for ARC Network - The Economic OS for the Internet.
 */
contract ArcAgenticLedger is Ownable, ReentrancyGuard {
    enum JobState { Open, Funded, Submitted, Completed, Rejected, Expired, Disputed }

    struct Job {
        uint256 id;
        address client;     // Person/Agent hiring
        address provider;   // Person/Agent performing the work
        address evaluator;  // Person/Agent/Contract verifying the work
        uint256 budget;     // Amount in USDC (6 decimals)
        JobState state;
        string description;
        string deliverableHash; // IPFS/Hash of the work
        uint256 createdAt;
        uint256 expiresAt;
        uint256 platformFee; // In USDC
    }

    IERC20 public immutable usdc;
    IArcAgentIdentity public agentIdentity;
    uint256 public jobCounter;
    uint256 public constant FEE_PERCENT = 1; // 0.1% platform fee (example)
    address public treasury;

    mapping(uint256 => Job) public jobs;
    mapping(address => uint256[]) public userJobs;

    event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, string description);
    event JobFunded(uint256 indexed jobId, uint256 amount);
    event JobSubmitted(uint256 indexed jobId, string deliverableHash);
    event JobCompleted(uint256 indexed jobId, address indexed evaluator);
    event JobRejected(uint256 indexed jobId, string reason);
    event JobDisputed(uint256 indexed jobId, address indexed raisedBy, string reason);
    event JobResolved(uint256 indexed jobId, uint256 providerPayout, uint256 clientRefund);
    event ReputationUpdated(address indexed user, uint256 newScore);

    constructor(address _usdc, address _treasury, address _identity) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        treasury = _treasury;
        agentIdentity = IArcAgentIdentity(_identity);
    }

    /**
     * @dev Step 1: Create a Job (Open State)
     */
    function createJob(
        address _provider,
        address _evaluator,
        uint256 _budget,
        uint256 _duration,
        string calldata _description
    ) external returns (uint256) {
        require(_provider != address(0), "Invalid provider");
        require(_evaluator != address(0), "Invalid evaluator");

        jobCounter++;
        uint256 jobId = jobCounter;

        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            provider: _provider,
            evaluator: _evaluator,
            budget: _budget,
            state: JobState.Open,
            description: _description,
            deliverableHash: "",
            createdAt: block.timestamp,
            expiresAt: block.timestamp + _duration,
            platformFee: (_budget * FEE_PERCENT) / 1000
        });

        userJobs[msg.sender].push(jobId);
        userJobs[_provider].push(jobId);
        if (_evaluator != msg.sender && _evaluator != _provider) {
            userJobs[_evaluator].push(jobId);
        }

        emit JobCreated(jobId, msg.sender, _provider, _description);
        return jobId;
    }

    /**
     * @dev Step 2: Fund the Job (Funded State) - Escrows USDC
     */
    function fundJob(uint256 _jobId) external nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.state == JobState.Open, "Not in Open state");
        require(msg.sender == job.client, "Only client can fund");

        require(
            usdc.transferFrom(msg.sender, address(this), job.budget),
            "Escrow transfer failed"
        );

        job.state = JobState.Funded;
        emit JobFunded(_jobId, job.budget);
    }

    /**
     * @dev Step 3: Submit Work (Submitted State)
     */
    function submitWork(uint256 _jobId, string calldata _deliverableHash) external {
        Job storage job = jobs[_jobId];
        require(job.state == JobState.Funded, "Not in Funded state");
        require(msg.sender == job.provider, "Only provider can submit");

        job.deliverableHash = _deliverableHash;
        job.state = JobState.Submitted;
        emit JobSubmitted(_jobId, _deliverableHash);
    }

    /**
     * @dev Step 4: Complete and Settle (Completed State)
     */
    function completeJob(uint256 _jobId) external nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.state == JobState.Submitted, "Not in Submitted state");
        require(msg.sender == job.evaluator, "Only evaluator can complete");

        uint256 payout = job.budget - job.platformFee;

        // Transfer payout to provider
        require(usdc.transfer(job.provider, payout), "Payout failed");

        // Transfer fee to treasury
        if (job.platformFee > 0) {
            require(usdc.transfer(treasury, job.platformFee), "Fee transfer failed");
        }

        job.state = JobState.Completed;

        if (address(agentIdentity) != address(0)) {
            agentIdentity.updateReputation(job.provider, 10);
        }

        emit JobCompleted(_jobId, msg.sender);
    }

    /**
     * @dev Reject Work or Cancel
     */
    function rejectJob(uint256 _jobId, string calldata _reason) external nonReentrant {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.evaluator || (msg.sender == job.client && job.state == JobState.Open), "Unauthorized");
        require(job.state == JobState.Funded || job.state == JobState.Submitted || job.state == JobState.Open, "Invalid state for rejection");

        if (job.state == JobState.Funded || job.state == JobState.Submitted) {
            // Refund client from escrow
            require(usdc.transfer(job.client, job.budget), "Refund failed");
        }

        job.state = JobState.Rejected;
        emit JobRejected(_jobId, _reason);
    }

    /**
     * @dev Raise a dispute (Client or Provider)
     */
    function raiseDispute(uint256 _jobId, string calldata _reason) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client || msg.sender == job.provider, "Unauthorized");
        require(job.state == JobState.Funded || job.state == JobState.Submitted, "Invalid state for dispute");

        job.state = JobState.Disputed;
        emit JobDisputed(_jobId, msg.sender, _reason);
    }

    /**
     * @dev Resolve a dispute (Arbitrator/Owner)
     */
    function resolveDispute(
        uint256 _jobId,
        uint256 _providerPayout,
        uint256 _clientRefund
    ) external onlyOwner nonReentrant {
        Job storage job = jobs[_jobId];
        require(job.state == JobState.Disputed, "Not in Disputed state");
        require(_providerPayout + _clientRefund == job.budget, "Invalid split");

        if (_providerPayout > 0) {
            require(usdc.transfer(job.provider, _providerPayout), "Provider payout failed");
        }
        if (_clientRefund > 0) {
            require(usdc.transfer(job.client, _clientRefund), "Client refund failed");
        }

        job.state = JobState.Completed; // Or a new Resolved state, but Completed is fine for ledger

        // Neutral or partial reputation adjustment could be added here
        if (_providerPayout >= job.budget / 2 && address(agentIdentity) != address(0)) {
             agentIdentity.updateReputation(job.provider, 5); // Partial reputation for partial work
        }

        emit JobResolved(_jobId, _providerPayout, _clientRefund);
    }

    /**
     * @dev Handle Expiry
     */
    function triggerExpiry(uint256 _jobId) external nonReentrant {
        Job storage job = jobs[_jobId];
        require(block.timestamp > job.expiresAt, "Not expired yet");
        require(job.state == JobState.Funded || job.state == JobState.Submitted, "Nothing to refund");

        require(usdc.transfer(job.client, job.budget), "Expiry refund failed");
        job.state = JobState.Expired;
    }

    // View functions
    function getJob(uint256 _jobId) external view returns (Job memory) {
        return jobs[_jobId];
    }

    function getUserJobs(address _user) external view returns (uint256[] memory) {
        return userJobs[_user];
    }

    function getJobDetails(uint256[] memory _jobIds) external view returns (Job[] memory) {
        Job[] memory details = new Job[](_jobIds.length);
        for (uint256 i = 0; i < _jobIds.length; i++) {
            details[i] = jobs[_jobIds[i]];
        }
        return details;
    }
}
