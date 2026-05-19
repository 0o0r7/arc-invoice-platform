// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title InvoiceManager
 * @dev Optimized for ARC Network - The Economic OS for the Internet
 * Implements real-world invoice workflows with stablecoin payments.
 */
contract InvoiceManager is Ownable, ReentrancyGuard {
    enum Status { Pending, Paid, Cancelled, Refunded }

    struct Invoice {
        uint256 id;
        address creator;
        address recipient;
        uint256 amount; // USDC (6 decimals)
        string description;
        uint256 createdAt;
        uint256 paidAt;
        Status status;
        string metadata; // For AI agent data or extra info (ERC-8183 style)
    }

    IERC20 public usdc;
    uint256 public invoiceCounter;
    mapping(uint256 => Invoice) public invoices;
    mapping(address => uint256[]) public userInvoices;

    event InvoiceCreated(
        uint256 indexed invoiceId,
        address indexed creator,
        address indexed recipient,
        uint256 amount,
        string description,
        string metadata
    );

    event InvoicePaid(
        uint256 indexed invoiceId,
        address indexed payer,
        uint256 amount
    );

    event InvoiceCancelled(uint256 indexed invoiceId);
    event InvoiceRefunded(uint256 indexed invoiceId);

    constructor(address _usdc) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
    }

    function createInvoice(
        address _recipient,
        uint256 _amount,
        string memory _description,
        string memory _metadata
    ) external returns (uint256) {
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than 0");

        invoiceCounter++;
        uint256 invoiceId = invoiceCounter;

        invoices[invoiceId] = Invoice({
            id: invoiceId,
            creator: msg.sender,
            recipient: _recipient,
            amount: _amount,
            description: _description,
            createdAt: block.timestamp,
            paidAt: 0,
            status: Status.Pending,
            metadata: _metadata
        });

        userInvoices[msg.sender].push(invoiceId);
        userInvoices[_recipient].push(invoiceId);

        emit InvoiceCreated(
            invoiceId,
            msg.sender,
            _recipient,
            _amount,
            _description,
            _metadata
        );

        return invoiceId;
    }

    function payInvoice(uint256 _invoiceId) external nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.id != 0, "Invoice does not exist");
        require(invoice.status == Status.Pending, "Invoice not in pending status");
        require(msg.sender == invoice.recipient, "Only recipient can pay");

        require(
            usdc.transferFrom(msg.sender, invoice.creator, invoice.amount),
            "USDC transfer failed"
        );

        invoice.status = Status.Paid;
        invoice.paidAt = block.timestamp;

        emit InvoicePaid(_invoiceId, msg.sender, invoice.amount);
    }

    function cancelInvoice(uint256 _invoiceId) external {
        Invoice storage invoice = invoices[_invoiceId];
        require(msg.sender == invoice.creator, "Only creator can cancel");
        require(invoice.status == Status.Pending, "Can only cancel pending invoices");

        invoice.status = Status.Cancelled;
        emit InvoiceCancelled(_invoiceId);
    }

    function refundInvoice(uint256 _invoiceId) external nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(msg.sender == invoice.creator, "Only creator can refund");
        require(invoice.status == Status.Paid, "Can only refund paid invoices");

        require(
            usdc.transferFrom(msg.sender, invoice.recipient, invoice.amount),
            "USDC refund transfer failed"
        );

        invoice.status = Status.Refunded;
        emit InvoiceRefunded(_invoiceId);
    }

    function getInvoice(uint256 _invoiceId)
        external
        view
        returns (Invoice memory)
    {
        return invoices[_invoiceId];
    }

    function getUserInvoices(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userInvoices[_user];
    }

    function getInvoiceDetails(uint256[] memory _invoiceIds)
        external
        view
        returns (Invoice[] memory)
    {
        Invoice[] memory details = new Invoice[](_invoiceIds.length);
        for (uint256 i = 0; i < _invoiceIds.length; i++) {
            details[i] = invoices[_invoiceIds[i]];
        }
        return details;
    }
}
