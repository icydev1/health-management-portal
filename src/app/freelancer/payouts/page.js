'use client';

import { useState } from 'react';
import Link from 'next/link';

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

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
  </svg>
);

export default function PayoutsPage() {
  const [filterStatus, setFilterStatus] = useState('all');

  const payouts = [
    {
      id: 1,
      txnId: 'TXN-2026-001',
      invoiceNum: 'INV-2026-045',
      amount: '€150',
      status: 'Paid',
      initiatedDate: '2026-03-06',
      completedDate: '2026-03-07',
      method: 'Bank Transfer',
    },
    {
      id: 2,
      txnId: 'TXN-2026-002',
      invoiceNum: 'INV-2026-042',
      amount: '€200',
      status: 'Processing',
      initiatedDate: '2026-03-05',
      completedDate: '—',
      method: 'Bank Transfer',
    },
    {
      id: 3,
      txnId: 'TXN-2026-003',
      invoiceNum: 'INV-2026-040',
      amount: '€180',
      status: 'Pending',
      initiatedDate: '2026-03-04',
      completedDate: '—',
      method: 'Bank Transfer',
    },
    {
      id: 4,
      txnId: 'TXN-2026-004',
      invoiceNum: 'INV-2026-038',
      amount: '€220',
      status: 'Paid',
      initiatedDate: '2026-02-28',
      completedDate: '2026-03-01',
      method: 'Bank Transfer',
    },
  ];

  const filteredPayouts = payouts.filter(
    (payout) => filterStatus === 'all' || payout.status === filterStatus
  );

  const totalPaid = payouts
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('€', '')), 0);

  const totalPending = payouts
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('€', '')), 0);

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
      default:
        return <ClockIcon />;
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payout History</h1>
          <p className="text-gray-600">Track your payment transactions and payout status</p>
        </div>
        <Link href="/freelancer/payouts/add">
          <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            Request Payout
          </button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Paid</h3>
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <CheckCircleIcon />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">€{totalPaid.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">Completed payouts</p>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
            <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600">
              <ClockIcon />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">€{totalPending.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">Awaiting approval</p>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Transactions</h3>
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <DownloadIcon />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{payouts.length}</p>
          <p className="text-sm text-gray-600 mt-2">All time</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
        >
          <option value="all">All Payouts</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Transaction ID</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Invoice #</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Initiated</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Completed</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{payout.txnId}</td>
                  <td className="px-6 py-4 text-gray-700">{payout.invoiceNum}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{payout.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(payout.status)}`}>
                      {getStatusIcon(payout.status)}
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{payout.initiatedDate}</td>
                  <td className="px-6 py-4 text-gray-600">{payout.completedDate}</td>
                  <td className="px-6 py-4 text-gray-600">{payout.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredPayouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No payouts found</p>
        </div>
      )}

      {/* Download Statement */}
      <div className="mt-8">
        <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          <DownloadIcon />
          Download Statement
        </button>
      </div>
    </div>
  );
}
