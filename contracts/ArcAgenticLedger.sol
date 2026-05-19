// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ArcAgenticLedger
 * @dev Implements ERC-8183 (Agentic Commerce) and ERC-8004 inspired reputation.
 * Purpose-built for ARC Network - The Economic OS for the Internet.
 */
contract ArcAgenticLedger is Ownable, ReentrancyGuard {
    enum JobState { Open, Funded, Submitted, Completed, Rejected, Expired }

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
    uint256 public jobCounter;
    uint256 public constant FEE_PERCENT = 1; // 0.1% platform fee (example)
    address public treasury;

    mapping(uint256 => Job) public jobs;
    mapping(address => uint256[]) public userJobs;
    mapping(address => uint256) public reputationScore; // Simple ERC-8004 style score

    event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, string description);
    event JobFunded(uint256 indexed jobId, uint256 amount);
    event JobSubmitted(uint256 indexed jobId, string deliverableHash);
    event JobCompleted(uint256 indexed jobId, address indexed evaluator);
    event JobRejected(uint256 indexed jobId, string reason);
    event ReputationUpdated(address indexed user, uint256 newScore);

    constructor(address _usdc, address _treasury) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        treasury = _treasury;
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
        reputationScore[job.provider] += 10; // Boost reputation

        emit JobCompleted(_jobId, msg.sender);
        emit ReputationUpdated(job.provider, reputationScore[job.provider]);
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
