// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/ArcAgenticLedger.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdcAddress = vm.envAddress("ARC_USDC_ADDRESS");
        address treasury = vm.addr(deployerPrivateKey); // Default treasury to deployer

        vm.startBroadcast(deployerPrivateKey);

        ArcAgenticLedger ledger = new ArcAgenticLedger(usdcAddress, treasury);

        console.log("ArcAgenticLedger deployed to:", address(ledger));

        vm.stopBroadcast();
    }
}
