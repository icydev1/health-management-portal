'use client';

import { useState } from 'react';
import Link from 'next/link';

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

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
  </svg>
);

export default function InvoicesPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState(null);

  const invoices = [
    {
      id: 1,
      invoiceNum: 'INV-2026-045',
      orderNum: 'ORD-2026-045',
      amount: '€150',
      status: 'Paid',
      submittedDate: '2026-03-05',
      approvedDate: '2026-03-06',
      filePath: '/invoices/INV-2026-045.pdf',
    },
    {
      id: 2,
      invoiceNum: 'INV-2026-042',
      orderNum: 'ORD-2026-042',
      amount: '€200',
      status: 'Approved',
      submittedDate: '2026-03-04',
      approvedDate: '2026-03-05',
      filePath: '/invoices/INV-2026-042.pdf',
    },
    {
      id: 3,
      invoiceNum: 'INV-2026-040',
      orderNum: 'ORD-2026-040',
      amount: '€180',
      status: 'Checked',
      submittedDate: '2026-03-02',
      approvedDate: '—',
      filePath: '/invoices/INV-2026-040.pdf',
    },
  ];

  const jobsAwaitingInvoice = [
    {
      id: 1,
      orderNum: 'ORD-2026-038',
      title: 'Customer Feedback Collection',
      amount: '€120',
    },
    {
      id: 2,
      orderNum: 'ORD-2026-036',
      title: 'Store Audit Report',
      amount: '€160',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceFile(file);
    }
  };

  const handleUploadInvoice = () => {
    if (selectedJob && invoiceFile) {
      setShowUploadModal(false);
      setSelectedJob(null);
      setInvoiceFile(null);
      alert('Invoice uploaded successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Invoices</h1>
          <p className="text-gray-600">Manage and track your invoices</p>
        </div>
        {/* <Link href="/freelancer/invoices/add">
          <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            Create Invoice
          </button>
        </Link> */}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submitted Invoices */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submitted Invoices</h2>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-600 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{invoice.invoiceNum}</p>
                    <p className="text-sm text-gray-600">{invoice.orderNum}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-semibold text-gray-900">{invoice.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Submitted</p>
                    <p className="font-semibold text-gray-900">{invoice.submittedDate}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-semibold">
                    <EyeIcon />
                    View
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-semibold">
                    <DownloadIcon />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Awaiting Invoice Upload</h2>
          <div className="space-y-4">
            {jobsAwaitingInvoice.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-600 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{job.orderNum}</p>
                    <p className="text-sm text-gray-600">{job.title}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Pending
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Amount to Invoice</p>
                  <p className="font-bold text-gray-900">{job.amount}</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowUploadModal(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors font-semibold"
                >
                  <UploadIcon />
                  Upload Invoice
                </button>
              </div>
            ))}
          </div>

          {jobsAwaitingInvoice.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No pending invoices</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Invoice</h2>
            <p className="text-gray-600 mb-6">
              {selectedJob?.orderNum} - {selectedJob?.title}
            </p>

            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Invoice File (PDF)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-600 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer">
                    <div className="text-gray-400 mb-2">
                      <UploadIcon />
                    </div>
                    <p className="text-gray-700 font-semibold">
                      {invoiceFile ? invoiceFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-600">PDF only</p>
                  </label>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Invoice Amount
                </label>
                <input
                  type="text"
                  value={selectedJob?.amount}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedJob(null);
                    setInvoiceFile(null);
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadInvoice}
                  disabled={!invoiceFile}
                  className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white rounded-lg transition-colors font-semibold"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
