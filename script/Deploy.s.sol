// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/ArcAgenticLedger.sol";
import "../contracts/ArcAgentIdentity.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdcAddress = vm.envAddress("ARC_USDC_ADDRESS");
        address treasury = vm.addr(deployerPrivateKey); // Default treasury to deployer

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Agent Identity Contract
        ArcAgentIdentity identity = new ArcAgentIdentity();
        console.log("ArcAgentIdentity deployed to:", address(identity));

        // 2. Deploy Agentic Ledger
        ArcAgenticLedger ledger = new ArcAgenticLedger(usdcAddress, treasury, address(identity));
        console.log("ArcAgenticLedger deployed to:", address(ledger));

        // 3. Authorize Ledger to update reputation
        identity.setAuthorizedCaller(address(ledger), true);
        console.log("Authorized Ledger on Identity contract");

        vm.stopBroadcast();
    }
}
