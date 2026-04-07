'use client';

import { useState } from 'react';
import Link from 'next/link';

const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"></path>
    <path fillRule="evenodd" d="M2 8a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8zm4 3a1 1 0 000 2h4a1 1 0 000-2H6z" clipRule="evenodd"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.293.707l-2.828 2.829a1 1 0 101.414 1.414L9 11.414V6z" clipRule="evenodd"></path>
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
  </svg>
);

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState('all');

  const payments = [
    {
      id: 1,
      invoiceNum: 'INV-2026-045',
      freelancer: 'Sarah Ahmed',
      amount: '€150',
      status: 'Paid',
      paidDate: '2026-03-06',
      method: 'Bank Transfer',
      reference: 'TXN-2026-001',
    },
    {
      id: 2,
      invoiceNum: 'INV-2026-044',
      freelancer: 'Mike Chen',
      amount: '€200',
      status: 'Processing',
      paidDate: '—',
      method: 'Bank Transfer',
      reference: 'TXN-2026-002',
    },
    {
      id: 3,
      invoiceNum: 'INV-2026-043',
      freelancer: 'Jessica Park',
      amount: '€180',
      status: 'Pending',
      paidDate: '—',
      method: '—',
      reference: '—',
    },
    {
      id: 4,
      invoiceNum: 'INV-2026-042',
      freelancer: 'Alex Brown',
      amount: '€220',
      status: 'Pending',
      paidDate: '—',
      method: '—',
      reference: '—',
    },
  ];

  const filteredPayments = payments.filter(
    (payment) => filterStatus === 'all' || payment.status === filterStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Paid':
        return 'bg-green-600 text-white';
      case 'Failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircleIcon />;
      case 'Processing':
        return <ClockIcon />;
      case 'Failed':
        return <AlertIcon />;
      default:
        return <ClockIcon />;
    }
  };

  const totalPending = filteredPayments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('€', '')), 0);

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payments</h1>
            <p className="text-gray-600">Manage freelancer payouts and payment status</p>
          </div>
          <Link href="/admin/payments/add">
            <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
              Add Payment
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Pending Payments</h3>
            <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600">
              <ClockIcon />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">€{totalPending.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">Awaiting approval</p>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Processing</h3>
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <CreditCardIcon />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">€200</p>
          <p className="text-sm text-gray-600 mt-2">In transit</p>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Paid (This Month)</h3>
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <CheckCircleIcon />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">€1,450</p>
          <p className="text-sm text-gray-600 mt-2">Successfully transferred</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Invoice #</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Freelancer</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Method</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Reference</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{payment.invoiceNum}</td>
                  <td className="px-6 py-4 text-gray-700">{payment.freelancer}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{payment.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{payment.method}</td>
                  <td className="px-6 py-4 text-gray-600">{payment.reference}</td>
                  <td className="px-6 py-4">
                    {payment.status === 'Pending' && (
                      <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold text-sm">
                        Pay Now
                      </button>
                    )}
                    {payment.status === 'Processing' && (
                      <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold text-sm">
                        View Status
                      </button>
                    )}
                    {payment.status === 'Paid' && (
                      <button className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold text-sm">
                        Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
