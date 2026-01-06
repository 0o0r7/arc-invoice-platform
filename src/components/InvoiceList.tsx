import { useState, useEffect } from 'react';
import { Receipt, Clock, CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { getInvoiceManagerContract, getUSDCContract, formatUSDC } from '../lib/arcNetwork';
import { upsertUserScore } from '../lib/supabase';

interface Invoice {
  id: bigint;
  creator: string;
  recipient: string;
  amount: bigint;
  description: string;
  createdAt: bigint;
  paidAt: bigint;
  isPaid: boolean;
}

interface InvoiceListProps {
  userAddress: string;
  refreshTrigger: number;
}

export default function InvoiceList({ userAddress, refreshTrigger }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payingInvoiceId, setPayingInvoiceId] = useState<bigint | null>(null);
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
        setInvoices(invoiceDetails);
        await updateCreditScore(invoiceDetails);
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
    const paid = items.filter(i => i.isPaid);
    const paidCount = paid.length;
    const totalAmountPaid = paid.reduce((acc, i) => acc + Number(parseFloat(formatUSDC(i.amount))), 0);
    const avgPaymentTime = paidCount > 0 ? paid.reduce((acc, i) => acc + Number(i.paidAt) - Number(i.createdAt), 0) / paidCount : 0;
    const base = 500;
    const score = base + paidCount * 10 + totalAmountPaid * 0.5 - avgPaymentTime * 0.01;
    return Math.max(0, Math.min(1000, Math.floor(score)));
  }

  function buildMetrics(items: Invoice[]) {
    const paid = items.filter(i => i.isPaid);
    const unpaid = items.filter(i => !i.isPaid);
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
    setPayingInvoiceId(invoiceId);
    try {
      const usdcContract = await getUSDCContract();
      const invoiceContract = await getInvoiceManagerContract();
      const contractAddress = await invoiceContract.getAddress();

      const allowance = await usdcContract.allowance(userAddress, contractAddress);
      if (allowance < amount) {
        const approveTx = await usdcContract.approve(contractAddress, amount);
        await approveTx.wait();
      }

      const payTx = await invoiceContract.payInvoice(invoiceId);
      await payTx.wait();

      await loadInvoices();
      alert('Invoice paid successfully!');
    } catch (error) {
      console.error('Error paying invoice:', error);
      alert('Failed to pay invoice. Please try again.');
    } finally {
      setPayingInvoiceId(null);
    }
  }

  function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatDate(timestamp: bigint): string {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading invoices...</span>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200">
        <div className="text-center text-gray-500">
          <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No invoices yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Your Invoices</h2>
          {creditScore !== null && (
            <div className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-800 text-sm font-medium">
              Credit Score: {creditScore}
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {invoices.map((invoice) => {
          const isRecipient = invoice.recipient.toLowerCase() === userAddress.toLowerCase();
          const canPay = isRecipient && !invoice.isPaid;

          return (
            <div key={invoice.id.toString()} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invoice.isPaid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.isPaid ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      Invoice #{invoice.id.toString()}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-2">{invoice.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">From:</span>{' '}
                      <a
                        href={`https://testnet.arcscan.app/address/${invoice.creator}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        {formatAddress(invoice.creator)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">To:</span>{' '}
                      <a
                        href={`https://testnet.arcscan.app/address/${invoice.recipient}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        {formatAddress(invoice.recipient)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {formatDate(invoice.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ${formatUSDC(invoice.amount)}
                  </div>
                  <div className="text-xs text-gray-500">USDC</div>
                </div>
              </div>

              {canPay && (
                <button
                  onClick={() => handlePayInvoice(invoice.id, invoice.amount)}
                  disabled={payingInvoiceId === invoice.id}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {payingInvoiceId === invoice.id ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Paying...
                    </span>
                  ) : (
                    'Pay Invoice'
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
