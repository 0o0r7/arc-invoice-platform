import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { getInvoiceManagerContract, parseUSDC } from '../lib/arcNetwork';

interface CreateInvoiceProps {
  onInvoiceCreated: () => void;
}

export default function CreateInvoice({ onInvoiceCreated }: CreateInvoiceProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsCreating(true);

    try {
      const contract = await getInvoiceManagerContract();
      const amountInUsdc = parseUSDC(amount);

      const tx = await contract.createInvoice(recipient, amountInUsdc, description);
      await tx.wait();

      setRecipient('');
      setAmount('');
      setDescription('');
      onInvoiceCreated();

      alert('Invoice created successfully!');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Create Invoice</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USDC)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.00"
            step="0.01"
            min="0.01"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment for services rendered..."
            rows={3}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Invoice...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Create Invoice
            </>
          )}
        </button>
      </form>
    </div>
  );
}
