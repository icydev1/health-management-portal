'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BackIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
  </svg>
);

export default function EditInvoice() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    invoiceId: 'INV-FL-2025-001',
    clientName: 'Tech Startup Inc',
    amount: 3200,
    status: 'Sent',
    dueDate: '2025-02-28',
    issueDate: '2025-01-28',
    description: 'Freelance consulting services',
    paymentTerms: 'Net 30',
    notes: 'Please process payment as per agreement',
    projectName: 'Market Analysis Project'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Invoice updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors font-semibold"
        >
          <BackIcon />
          Back to Invoices
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Invoice</h1>
        <p className="text-gray-600">Update invoice details</p>
      </div>

      {message && (
        <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold">
          ✓ {message}
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-lg p-8">

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Invoice ID</label>
                <input
                  type="text"
                  name="invoiceId"
                  value={formData.invoiceId}
                  disabled
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-500 cursor-not-allowed bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                >
                  <option>Draft</option>
                  <option>Sent</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Payment Terms</label>
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                >
                  <option>Net 7</option>
                  <option>Net 14</option>
                  <option>Net 30</option>
                  <option>Due on receipt</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Issue Date</label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded font-medium transition"
              >
                <SaveIcon />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    
  );
}
