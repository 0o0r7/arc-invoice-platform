import { useState, useEffect } from 'react';
import { Receipt, Clock, CheckCircle, XCircle, RefreshCcw, Loader2, ExternalLink, ShieldCheck, Download } from 'lucide-react';
import { getInvoiceManagerContract, getUSDCContract, formatUSDC, GAS_SETTINGS } from '../lib/arcNetwork';
import { upsertUserScore } from '../lib/supabase';

enum InvoiceStatus { Pending, Paid, Cancelled, Refunded }

interface Invoice {
  id: bigint;
  creator: string;
  recipient: string;
  amount: bigint;
  description: string;
  createdAt: bigint;
  paidAt: bigint;
  status: InvoiceStatus;
  metadata: string;
}

interface InvoiceListProps {
  userAddress: string;
  refreshTrigger: number;
}

export default function InvoiceList({ userAddress, refreshTrigger }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null); // "pay-id", "cancel-id", "refund-id"
  const [creditScore, setCreditScore] = useState<number | null>(null);

  useEffect(() => {
    if (userAddress) {
      loadInvoices();
    }
  }, [userAddress, refreshTrigger]);

  async function loadInvoices() {
    setIsLoading(true);
    try {
      const contract = await getInvoiceManagerContract();
      const invoiceIds = await contract.getUserInvoices(userAddress);

      if (invoiceIds.length > 0) {
        const invoiceDetails = await contract.getInvoiceDetails(invoiceIds);
        // Sort by ID descending
        const sorted = [...invoiceDetails].sort((a, b) => Number(b.id - a.id));
        setInvoices(sorted);
        await updateCreditScore(sorted);
      } else {
        setInvoices([]);
        setCreditScore(null);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCreditScore(items: Invoice[]) {
    try {
      const score = computeCreditScore(items);
      setCreditScore(score);
      await upsertUserScore(userAddress, score, buildMetrics(items));
    } catch (e) {
      console.error(e);
    }
  }

  function computeCreditScore(items: Invoice[]) {
    const paid = items.filter(i => Number(i.status) === InvoiceStatus.Paid);
    const paidCount = paid.length;
    const totalAmountPaid = paid.reduce((acc, i) => acc + Number(parseFloat(formatUSDC(i.amount))), 0);
    const avgPaymentTime = paidCount > 0 ? paid.reduce((acc, i) => acc + Number(i.paidAt) - Number(i.createdAt), 0) / paidCount : 0;
    const base = 500;
    const score = base + paidCount * 15 + totalAmountPaid * 0.5 - (avgPaymentTime / 3600) * 5; // Penalty per hour delayed
    return Math.max(0, Math.min(1000, Math.floor(score)));
  }

  function buildMetrics(items: Invoice[]) {
    const paid = items.filter(i => Number(i.status) === InvoiceStatus.Paid);
    const unpaid = items.filter(i => Number(i.status) === InvoiceStatus.Pending);
    const totalAmountPaid = paid.reduce((acc, i) => acc + Number(parseFloat(formatUSDC(i.amount))), 0);
    const avgPaymentTime = paid.length > 0 ? paid.reduce((acc, i) => acc + Number(i.paidAt) - Number(i.createdAt), 0) / paid.length : 0;
    return {
      paid_count: paid.length,
      unpaid_count: unpaid.length,
      total_amount_paid: totalAmountPaid,
      avg_payment_time_sec: avgPaymentTime
    };
  }

  async function handlePayInvoice(invoiceId: bigint, amount: bigint) {
    const actionKey = `pay-${invoiceId}`;
    setActionInProgress(actionKey);
    try {
      const usdcContract = await getUSDCContract();
      const invoiceContract = await getInvoiceManagerContract();
      const contractAddress = await invoiceContract.getAddress();

      const allowance = await usdcContract.allowance(userAddress, contractAddress);
      if (allowance < amount) {
        const approveTx = await usdcContract.approve(contractAddress, amount, { ...GAS_SETTINGS });
        await approveTx.wait();
      }

      const payTx = await invoiceContract.payInvoice(invoiceId, { ...GAS_SETTINGS });
      await payTx.wait();

      await loadInvoices();
      alert('Invoice paid successfully on Arc!');
    } catch (error) {
      console.error('Error paying invoice:', error);
      alert('Failed to pay invoice. Please check your USDC balance and try again.');
    } finally {
      setActionInProgress(null);
    }
  }

  async function handleCancelInvoice(invoiceId: bigint) {
    const actionKey = `cancel-${invoiceId}`;
    setActionInProgress(actionKey);
    try {
      const contract = await getInvoiceManagerContract();
      const tx = await contract.cancelInvoice(invoiceId, { ...GAS_SETTINGS });
      await tx.wait();
      await loadInvoices();
    } catch (error) {
      console.error('Error cancelling invoice:', error);
    } finally {
      setActionInProgress(null);
    }
  }

  async function handleRefundInvoice(invoiceId: bigint, amount: bigint) {
    const actionKey = `refund-${invoiceId}`;
    setActionInProgress(actionKey);
    try {
      const usdcContract = await getUSDCContract();
      const invoiceContract = await getInvoiceManagerContract();
      const contractAddress = await invoiceContract.getAddress();

      const allowance = await usdcContract.allowance(userAddress, contractAddress);
      if (allowance < amount) {
        const approveTx = await usdcContract.approve(contractAddress, amount, { ...GAS_SETTINGS });
        await approveTx.wait();
      }

      const tx = await invoiceContract.refundInvoice(invoiceId, { ...GAS_SETTINGS });
      await tx.wait();
      await loadInvoices();
      alert('Invoice refunded successfully!');
    } catch (error) {
      console.error('Error refunding invoice:', error);
      alert('Refund failed. Ensure you have enough USDC.');
    } finally {
      setActionInProgress(null);
    }
  }

  function downloadPDF(invoice: Invoice) {
    const content = `
      ARC NETWORK INVOICE
      -------------------
      Invoice ID: ${invoice.id.toString()}
      Status: ${InvoiceStatus[Number(invoice.status)]}
      Creator: ${invoice.creator}
      Recipient: ${invoice.recipient}
      Amount: ${formatUSDC(invoice.amount)} USDC
      Description: ${invoice.description}
      Metadata: ${invoice.metadata || 'N/A'}
      Created At: ${formatDate(invoice.createdAt)}
      Paid At: ${invoice.paidAt > 0n ? formatDate(invoice.paidAt) : 'N/A'}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${invoice.id.toString()}.txt`;
    a.click();
  }

  function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatDate(timestamp: bigint): string {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  }

  function getStatusBadge(status: number) {
    switch (Number(status)) {
      case InvoiceStatus.Paid:
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Paid</span>;
      case InvoiceStatus.Cancelled:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      case InvoiceStatus.Refunded:
        return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><RefreshCcw className="w-3 h-3" /> Refunded</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Syncing with Arc Blockchain...</span>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
        <div className="text-center text-gray-500">
          <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No invoices found on your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">Arc Ledger</h2>
            <ShieldCheck className="w-5 h-5 text-blue-500" title="Verified on Arc Network" />
          </div>
          {creditScore !== null && (
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Business Score</div>
              <div className="text-2xl font-black text-indigo-600">{creditScore}</div>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {invoices.map((invoice) => {
          const isCreator = invoice.creator.toLowerCase() === userAddress.toLowerCase();
          const isRecipient = invoice.recipient.toLowerCase() === userAddress.toLowerCase();
          const canPay = isRecipient && Number(invoice.status) === InvoiceStatus.Pending;
          const canCancel = isCreator && Number(invoice.status) === InvoiceStatus.Pending;
          const canRefund = isCreator && Number(invoice.status) === InvoiceStatus.Paid;

          return (
            <div key={invoice.id.toString()} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(Number(invoice.status))}
                    <span className="text-xs text-gray-400 font-mono">
                      #ARC-{invoice.id.toString().padStart(4, '0')}
                    </span>
                  </div>

                  <p className="text-lg font-medium text-gray-900 mb-1">{invoice.description}</p>

                  {invoice.metadata && (
                    <div className="mb-3 p-2 bg-gray-50 rounded border border-gray-100 text-[10px] font-mono text-gray-500 max-w-md truncate">
                      META: {invoice.metadata}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 w-12">From:</span>
                      <a href={`https://testnet.arcscan.app/address/${invoice.creator}`} target="_blank" rel="noopener" className="text-blue-600 hover:underline flex items-center gap-1">
                        {formatAddress(invoice.creator)} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 w-12">To:</span>
                      <a href={`https://testnet.arcscan.app/address/${invoice.recipient}`} target="_blank" rel="noopener" className="text-blue-600 hover:underline flex items-center gap-1">
                        {formatAddress(invoice.recipient)} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 w-12">Created:</span>
                      <span>{formatDate(invoice.createdAt)}</span>
                    </div>
                    {invoice.paidAt > 0n && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 w-12">Paid:</span>
                        <span>{formatDate(invoice.paidAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-3xl font-black text-gray-900 leading-none">
                      ${formatUSDC(invoice.amount)}
                    </div>
                    <div className="text-xs font-bold text-gray-400">USDC</div>
                  </div>

                  <button
                    onClick={() => downloadPDF(invoice)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <Download className="w-3 h-3" /> Export Invoice
                  </button>
                </div>
              </div>

              {(canPay || canCancel || canRefund) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {canPay && (
                    <button
                      onClick={() => handlePayInvoice(invoice.id, invoice.amount)}
                      disabled={actionInProgress !== null}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-bold text-sm"
                    >
                      {actionInProgress === `pay-${invoice.id}` ? 'Processing Payment...' : 'Pay with USDC'}
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => handleCancelInvoice(invoice.id)}
                      disabled={actionInProgress !== null}
                      className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 font-bold text-sm"
                    >
                      {actionInProgress === `cancel-${invoice.id}` ? 'Cancelling...' : 'Cancel Invoice'}
                    </button>
                  )}
                  {canRefund && (
                    <button
                      onClick={() => handleRefundInvoice(invoice.id, invoice.amount)}
                      disabled={actionInProgress !== null}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 font-bold text-sm"
                    >
                      {actionInProgress === `refund-${invoice.id}` ? 'Processing Refund...' : 'Issue Refund'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
