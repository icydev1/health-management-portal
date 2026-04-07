'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BackIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
  </svg>
);

export default function AddInvoicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    freelancerName: '',
    amount: '',
    dueDate: '',
    status: 'Pending',
    description: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Invoice created successfully!');
    setTimeout(() => {
      router.push('/admin/invoices');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors font-semibold"
        >
          <BackIcon />
          Back to Invoices
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Invoice</h1>
        <p className="text-gray-600">Add a new invoice for a freelancer</p>
      </div>

      {message && (
        <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold">
          ✓ {message}
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Invoice Number *</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-green-600 focus:outline-none"
                placeholder="e.g., INV-001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Freelancer Name *</label>
              <input
                type="text"
                name="freelancerName"
                value={formData.freelancerName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-green-600 focus:outline-none"
                placeholder="Enter freelancer name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-green-600 focus:outline-none"
                placeholder="Enter amount"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-green-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-green-600 focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-green-600 focus:outline-none"
              placeholder="Enter invoice description"
              rows="4"
            />
          </div>

          <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <SaveIcon />
              Create Invoice
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
