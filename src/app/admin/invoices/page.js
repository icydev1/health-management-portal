'use client';

import { useState } from 'react';
import Link from 'next/link';

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
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

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const invoices = [
    {
      id: 1,
      invoiceNum: 'INV-2026-045',
      orderNum: 'ORD-2026-045',
      freelancer: 'Sarah Ahmed',
      amount: '€150',
      status: 'Paid',
      submittedDate: '2026-03-05',
      approvedDate: '2026-03-06',
    },
    {
      id: 2,
      invoiceNum: 'INV-2026-044',
      orderNum: 'ORD-2026-044',
      freelancer: 'Mike Chen',
      amount: '€200',
      status: 'Approved',
      submittedDate: '2026-03-04',
      approvedDate: '2026-03-05',
    },
    {
      id: 3,
      invoiceNum: 'INV-2026-043',
      orderNum: 'ORD-2026-043',
      freelancer: 'Jessica Park',
      amount: '€180',
      status: 'Checked',
      submittedDate: '2026-03-02',
      approvedDate: '—',
    },
    {
      id: 4,
      invoiceNum: 'INV-2026-042',
      orderNum: 'ORD-2026-042',
      freelancer: 'Alex Brown',
      amount: '€220',
      status: 'Uploaded',
      submittedDate: '2026-03-01',
      approvedDate: '—',
    },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.invoiceNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.freelancer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Uploaded':
        return 'bg-blue-100 text-blue-700';
      case 'Checked':
        return 'bg-yellow-100 text-yellow-700';
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'Paid':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircleIcon />;
      case 'Approved':
        return <CheckCircleIcon />;
      case 'Checked':
        return <ClockIcon />;
      default:
        return <ClockIcon />;
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Invoices</h1>
            <p className="text-gray-600">Review and approve freelancer invoices</p>
          </div>
          <Link href="/admin/invoices/add">
            <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
              Create Invoice
            </button>
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4 flex-col md:flex-row">
        <div className="flex-1 relative">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by invoice number or freelancer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="Uploaded">Uploaded</option>
          <option value="Checked">Checked</option>
          <option value="Approved">Approved</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Invoice #</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Order #</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Freelancer</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Submitted</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{invoice.invoiceNum}</td>
                  <td className="px-6 py-4 text-gray-700">{invoice.orderNum}</td>
                  <td className="px-6 py-4 text-gray-700">{invoice.freelancer}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{invoice.amount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{invoice.submittedDate}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <EyeIcon />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <DownloadIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No invoices found</p>
        </div>
      )}
    </div>
  );
}
