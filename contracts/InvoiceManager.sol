// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract InvoiceManager is Ownable, ReentrancyGuard {
    struct Invoice {
        uint256 id;
        address creator;
        address recipient;
        uint256 amount;
        string description;
        uint256 createdAt;
        uint256 paidAt;
        bool isPaid;
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
        string description
    );

    event InvoicePaid(
        uint256 indexed invoiceId,
        address indexed payer,
        uint256 amount
    );

    constructor(address _usdc) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
    }

    function createInvoice(
        address _recipient,
        uint256 _amount,
        string memory _description
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
            isPaid: false
        });

        userInvoices[msg.sender].push(invoiceId);
        userInvoices[_recipient].push(invoiceId);

        emit InvoiceCreated(
            invoiceId,
            msg.sender,
            _recipient,
            _amount,
            _description
        );

        return invoiceId;
    }

    function payInvoice(uint256 _invoiceId) external nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.id != 0, "Invoice does not exist");
        require(!invoice.isPaid, "Invoice already paid");
        require(msg.sender == invoice.recipient, "Only recipient can pay");

        require(
            usdc.transferFrom(msg.sender, invoice.creator, invoice.amount),
            "USDC transfer failed"
        );

        invoice.isPaid = true;
        invoice.paidAt = block.timestamp;

        emit InvoicePaid(_invoiceId, msg.sender, invoice.amount);
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
