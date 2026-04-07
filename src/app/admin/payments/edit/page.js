'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPayment() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    payoutId: '',
    amount: '',
    bankAccount: '',
    payoutDate: '',
    status: 'Pending',
    notes: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/admin/payments');
    }, 2000);
  };

  const handleCancel = () => {
    router.push('/admin/payments');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Back to Payments
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Payment</h1>
        <p className="text-gray-600">Update payment information</p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg">
          ✓ Payment updated successfully!
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Payout ID</label>
              <input
                type="text"
                name="payoutId"
                value={formData.payoutId}
                disabled
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-500 bg-gray-100 focus:outline-none transition"
                placeholder="Auto-generated"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Bank Account *</label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="Enter bank account"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Payout Date *</label>
              <input
                type="date"
                name="payoutDate"
                value={formData.payoutDate}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-3">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-3">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="6"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition resize-none"
              placeholder="Payment notes..."
            />
          </div>

          <div className="flex gap-4 justify-end pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition"
            >
              Update Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
