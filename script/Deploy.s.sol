// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/InvoiceManager.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdcAddress = vm.envAddress("ARC_USDC_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        InvoiceManager invoiceManager = new InvoiceManager(usdcAddress);

        console.log("InvoiceManager deployed to:", address(invoiceManager));

        vm.stopBroadcast();
    }
}
