// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/ArcAgenticLedger.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {}
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract ArcAgenticLedgerTest is Test {
    ArcAgenticLedger public ledger;
    MockUSDC public usdc;
    address public client = address(0x111);
    address public provider = address(0x222);
    address public evaluator = address(0x333);
    address public treasury = address(0x444);

    function setUp() public {
        usdc = new MockUSDC();
        ledger = new ArcAgenticLedger(address(usdc), treasury);
        usdc.mint(client, 1000e6);
    }

    function testFullLifecycle() public {
        uint256 budget = 100e6;

        // 1. Create Job
        vm.prank(client);
        uint256 jobId = ledger.createJob(provider, evaluator, budget, 1 days, "AI Analysis");

        ArcAgenticLedger.Job memory job = ledger.getJob(jobId);
        assertEq(uint(job.state), uint(ArcAgenticLedger.JobState.Open));

        // 2. Fund Job (Escrow)
        vm.startPrank(client);
        usdc.approve(address(ledger), budget);
        ledger.fundJob(jobId);
        vm.stopPrank();

        assertEq(usdc.balanceOf(address(ledger)), budget);
        assertEq(uint(ledger.getJob(jobId).state), uint(ArcAgenticLedger.JobState.Funded));

        // 3. Submit Work
        vm.prank(provider);
        ledger.submitWork(jobId, "ipfs://work-hash");
        assertEq(uint(ledger.getJob(jobId).state), uint(ArcAgenticLedger.JobState.Submitted));

        // 4. Complete and Payout
        vm.prank(evaluator);
        ledger.completeJob(jobId);

        uint256 fee = (budget * 1) / 1000; // 0.1%
        assertEq(usdc.balanceOf(provider), budget - fee);
        assertEq(usdc.balanceOf(treasury), fee);
        assertEq(uint(ledger.getJob(jobId).state), uint(ArcAgenticLedger.JobState.Completed));
        assertEq(ledger.reputationScore(provider), 10);
    }

    function testRejectAndRefund() public {
        uint256 budget = 100e6;
        vm.prank(client);
        uint256 jobId = ledger.createJob(provider, evaluator, budget, 1 days, "AI Analysis");

        vm.startPrank(client);
        usdc.approve(address(ledger), budget);
        ledger.fundJob(jobId);
        vm.stopPrank();

        vm.prank(evaluator);
        ledger.rejectJob(jobId, "Low quality");

        assertEq(usdc.balanceOf(client), 1000e6);
        assertEq(uint(ledger.getJob(jobId).state), uint(ArcAgenticLedger.JobState.Rejected));
    }
}
