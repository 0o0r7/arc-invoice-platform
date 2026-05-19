// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/InvoiceManager.sol";
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

contract InvoiceManagerTest is Test {
    InvoiceManager public manager;
    MockUSDC public usdc;
    address public creator = address(1);
    address public recipient = address(2);

    function setUp() public {
        usdc = new MockUSDC();
        manager = new InvoiceManager(address(usdc));
    }

    function testCreateInvoice() public {
        vm.prank(creator);
        uint256 id = manager.createInvoice(recipient, 100e6, "Test Invoice", "meta");

        InvoiceManager.Invoice memory inv = manager.getInvoice(id);
        assertEq(inv.id, id);
        assertEq(inv.creator, creator);
        assertEq(inv.recipient, recipient);
        assertEq(inv.amount, 100e6);
        assertEq(uint(inv.status), uint(InvoiceManager.Status.Pending));
    }

    function testPayInvoice() public {
        uint256 amount = 100e6;
        vm.prank(creator);
        uint256 id = manager.createInvoice(recipient, amount, "Test Invoice", "meta");

        usdc.mint(recipient, amount);

        vm.startPrank(recipient);
        usdc.approve(address(manager), amount);
        manager.payInvoice(id);
        vm.stopPrank();

        InvoiceManager.Invoice memory inv = manager.getInvoice(id);
        assertEq(uint(inv.status), uint(InvoiceManager.Status.Paid));
        assertEq(usdc.balanceOf(creator), amount);
    }

    function testCancelInvoice() public {
        vm.prank(creator);
        uint256 id = manager.createInvoice(recipient, 100e6, "Test Invoice", "meta");

        vm.prank(creator);
        manager.cancelInvoice(id);

        InvoiceManager.Invoice memory inv = manager.getInvoice(id);
        assertEq(uint(inv.status), uint(InvoiceManager.Status.Cancelled));
    }

    function testRefundInvoice() public {
        uint256 amount = 100e6;
        vm.prank(creator);
        uint256 id = manager.createInvoice(recipient, amount, "Test Invoice", "meta");

        usdc.mint(recipient, amount);
        vm.startPrank(recipient);
        usdc.approve(address(manager), amount);
        manager.payInvoice(id);
        vm.stopPrank();

        // Creator must approve to refund
        vm.startPrank(creator);
        usdc.approve(address(manager), amount);
        manager.refundInvoice(id);
        vm.stopPrank();

        InvoiceManager.Invoice memory inv = manager.getInvoice(id);
        assertEq(uint(inv.status), uint(InvoiceManager.Status.Refunded));
        assertEq(usdc.balanceOf(recipient), amount);
    }
}
