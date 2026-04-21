'use client';

import { useState, useRef } from 'react';

// ─── Mock completed orders available for invoicing ────────────────────────────
const COMPLETED_ORDERS = [
  { id: 'ORD-2026-045', title: 'Nutrition Presentation – PharmaGroup GmbH', date: '2026-04-10', baseRate: 350, city: 'Munich'    },
  { id: 'ORD-2026-038', title: 'Employee Wellness Workshop – Bosch GmbH',   date: '2026-03-25', baseRate: 480, city: 'Stuttgart' },
];

const INIT_INVOICES = [
  {
    id: '1', num: 'INV-2026-012', orderRef: 'ORD-2026-045',
    description: 'Nutrition Presentation – PharmaGroup GmbH',
    amount: 350, travel: 40, total: 390,
    date: '2026-04-10', due: '2026-04-24',
    status: 'paid',
    feedbackUploaded: true, feedbackFile: 'feedback-PharmaGroup-ORD-2026-045.pdf',
    type: 'generated',
  },
  {
    id: '2', num: 'INV-2026-010', orderRef: 'ORD-2026-038',
    description: 'Employee Wellness Workshop – Bosch GmbH',
    amount: 480, travel: 65, total: 545,
    date: '2026-03-25', due: '2026-04-08',
    status: 'approved',
    feedbackUploaded: true, feedbackFile: 'feedback-Bosch-ORD-2026-038.pdf',
    type: 'generated',
  },
  {
    id: '3', num: 'INV-2026-008', orderRef: 'ORD-2026-041',
    description: 'Cardio Screening – Deutsche Telekom',
    amount: 290, travel: 0, total: 290,
    date: '2026-04-05', due: '2026-04-19',
    status: 'pending',
    feedbackUploaded: false, feedbackFile: null,
    type: 'uploaded',
  },
  {
    id: '4', num: 'INV-2026-006', orderRef: 'ORD-2026-039',
    description: 'Retail Audit – RetailPlus GmbH',
    amount: 160, travel: 20, total: 180,
    date: '2026-03-30', due: '2026-04-13',
    status: 'on_hold',
    feedbackUploaded: false, feedbackFile: null,
    type: 'uploaded',
  },
];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  on_hold:   { label: 'On Hold',   cls: 'bg-orange-100 text-orange-700 border-orange-200' },
  approved:  { label: 'Approved',  cls: 'bg-blue-100 text-blue-700 border-blue-200'       },
  paid:      { label: 'Paid',      cls: 'bg-green-100 text-green-700 border-green-200'    },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600 border-red-200'          },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200' };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>{cfg.label}</span>;
}

// ─── File drop zone ───────────────────────────────────────────────────────────
function FileDropZone({ label, hint, file, onChange }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  };

  return (
    <div
      onClick={() => ref.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
        drag ? 'border-green-500 bg-green-50' : file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
      }`}
    >
      <input ref={ref} type="file" accept=".pdf" className="hidden" onChange={(e) => onChange(e.target.files[0])} />
      {file ? (
        <div className="flex items-center justify-center gap-2 text-green-700">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>
          <span className="text-sm font-semibold truncate max-w-xs">{file.name}</span>
          <button onClick={(e) => { e.stopPropagation(); onChange(null); }} className="text-red-400 hover:text-red-600 ml-1 shrink-0">✕</button>
        </div>
      ) : (
        <>
          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </>
      )}
    </div>
  );
}

// ─── Upload feedback form modal (for existing invoices missing the form) ─────────
function UploadFeedbackModal({ invoice, onClose, onSave }) {
  const [file, setFile] = useState(null);

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Upload Client Feedback Form</h3>
            <p className="text-sm text-gray-500">{invoice.num} · {invoice.orderRef}</p>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-5 flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
          <div>
            <p className="text-xs font-semibold text-amber-800">Signed feedback form required</p>
            <p className="text-xs text-amber-700 mt-0.5">Please collect the signed feedback form from the client and upload it here. Your invoice cannot be settled until this is received.</p>
          </div>
        </div>

        <FileDropZone
          label="Drop the signed feedback form here or click to browse"
          hint="PDF only · The form must be signed by the client contact person"
          file={file}
          onChange={setFile}
        />

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => { if (file) { onSave(invoice.id, file.name); onClose(); } }}
            disabled={!file}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white font-bold rounded-lg text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Upload Feedback Form
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Submit Invoice modal ─────────────────────────────────────────────────────
function SubmitInvoiceModal({ onClose, onSubmit }) {
  const [tab, setTab] = useState('generate');

  // Generate tab
  const [selectedOrder, setSelectedOrder] = useState('');
  const [travel, setTravel]               = useState('');
  const [expenses, setExpenses]           = useState('');
  const [expenseNote, setExpenseNote]     = useState('');
  const [feedbackFile, setEvalFile]           = useState(null);
  const [preview, setPreview]             = useState(false);

  // Upload tab
  const [invoiceFile, setInvoiceFile]     = useState(null);
  const [uploadEvalFile, setUploadEvalFile] = useState(null);
  const [uploadOrderRef, setUploadOrderRef] = useState('');
  const [uploadAmount, setUploadAmount]   = useState('');

  const order       = COMPLETED_ORDERS.find((o) => o.id === selectedOrder);
  const travelAmt   = parseFloat(travel)   || 0;
  const expensesAmt = parseFloat(expenses) || 0;
  const subtotal    = order ? order.baseRate + travelAmt + expensesAmt : 0;
  const vat         = subtotal * 0.19;
  const total       = subtotal + vat;

  const canGenerate = !!selectedOrder && !!feedbackFile;
  const canUpload   = !!invoiceFile && !!uploadEvalFile && !!uploadOrderRef && !!uploadAmount;

  const handleSubmit = () => {
    if (tab === 'generate') {
      onSubmit({ type: 'generated', orderRef: selectedOrder, description: order?.title ?? '', amount: order?.baseRate ?? 0, travel: travelAmt, total: subtotal, feedbackFile: feedbackFile?.name });
    } else {
      onSubmit({ type: 'uploaded', orderRef: uploadOrderRef, description: `Invoice for ${uploadOrderRef}`, amount: parseFloat(uploadAmount) || 0, travel: 0, total: parseFloat(uploadAmount) || 0, feedbackFile: uploadEvalFile?.name, invoiceFile: invoiceFile?.name });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-4">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Submit Invoice</h3>
            <p className="text-sm text-gray-500 mt-0.5">Generate from your assignment or upload your own invoice PDF.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors text-lg">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mx-6 mt-5">
          {[
            { key: 'generate', label: 'Generate from Assignment' },
            { key: 'upload',   label: 'Upload My Own Invoice'    },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* ── Generate tab ── */}
          {tab === 'generate' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Completed Assignment</label>
                <select value={selectedOrder} onChange={(e) => { setSelectedOrder(e.target.value); setPreview(false); }}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm bg-white"
                >
                  <option value="">— Choose an order —</option>
                  {COMPLETED_ORDERS.map((o) => (
                    <option key={o.id} value={o.id}>{o.id} · {o.title}</option>
                  ))}
                </select>
              </div>

              {order && (
                <>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm">
                    <p className="font-semibold text-gray-800">{order.title}</p>
                    <p className="text-gray-500 mt-0.5">Base rate: <strong className="text-gray-700">€{order.baseRate.toFixed(2)}</strong> · {order.date} · {order.city}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Travel Allowance (€) <span className="font-normal text-gray-400">optional</span></label>
                      <input type="number" min="0" step="0.01" placeholder="0.00" value={travel} onChange={(e) => setTravel(e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Other Expenses (€) <span className="font-normal text-gray-400">optional</span></label>
                      <input type="number" min="0" step="0.01" placeholder="0.00" value={expenses} onChange={(e) => setExpenses(e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  {expensesAmt > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Expense Description</label>
                      <input type="text" placeholder="e.g. Parking, materials, accommodation…" value={expenseNote} onChange={(e) => setExpenseNote(e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm"
                      />
                    </div>
                  )}

                  <button onClick={() => setPreview((p) => !p)}
                    className="w-full py-2 text-sm font-semibold text-green-700 border-2 border-green-200 hover:border-green-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    {preview ? 'Hide Preview' : 'Preview Invoice'}
                  </button>

                  {preview && (
                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden text-xs">
                      <div className="bg-green-700 px-4 py-3 flex justify-between items-center">
                        <div className="text-white">
                          <p className="font-black text-sm">FreelanceHub GmbH</p>
                          <p className="text-green-200 text-[11px]">Unter den Linden 10, 10117 Berlin</p>
                        </div>
                        <div className="text-right text-white">
                          <p className="font-black text-base">INVOICE</p>
                          <p className="text-green-200 text-[11px]">{new Date().toISOString().slice(0,10)}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <table className="w-full text-[11px]">
                          <thead><tr className="bg-gray-50"><th className="text-left px-2 py-1.5 text-gray-500 font-semibold">Description</th><th className="text-right px-2 py-1.5 text-gray-500 font-semibold">Amount</th></tr></thead>
                          <tbody>
                            <tr className="border-b border-gray-100"><td className="px-2 py-1.5 text-gray-700">{order.title}</td><td className="px-2 py-1.5 text-right font-semibold">€{order.baseRate.toFixed(2)}</td></tr>
                            {travelAmt   > 0 && <tr className="border-b border-gray-100"><td className="px-2 py-1.5 text-gray-700">Travel allowance</td><td className="px-2 py-1.5 text-right font-semibold">€{travelAmt.toFixed(2)}</td></tr>}
                            {expensesAmt > 0 && <tr className="border-b border-gray-100"><td className="px-2 py-1.5 text-gray-700">{expenseNote || 'Other expenses'}</td><td className="px-2 py-1.5 text-right font-semibold">€{expensesAmt.toFixed(2)}</td></tr>}
                          </tbody>
                          <tfoot>
                            <tr><td className="px-2 py-1 text-right text-gray-500">Subtotal</td><td className="px-2 py-1 text-right">€{subtotal.toFixed(2)}</td></tr>
                            <tr><td className="px-2 py-1 text-right text-gray-500">VAT (19%)</td><td className="px-2 py-1 text-right">€{vat.toFixed(2)}</td></tr>
                            <tr className="font-black text-green-700"><td className="px-2 py-2 text-right border-t-2 border-green-600">Total</td><td className="px-2 py-2 text-right border-t-2 border-green-600">€{total.toFixed(2)}</td></tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Evaluation form upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Signed Client Feedback Form <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Ask the client contact to sign the feedback form after the assignment and upload it here. Payment cannot be released without it.</p>
                <FileDropZone
                  label="Upload signed client feedback form"
                  hint="PDF only · PDF only · Must be signed by the client"
                  file={feedbackFile}
                  onChange={setEvalFile}
                />
              </div>
            </>
          )}

          {/* ── Upload own invoice tab ── */}
          {tab === 'upload' && (
            <>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                <p className="text-xs text-blue-800">Make sure your invoice includes your full name, IBAN, tax ID, and the order reference number.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order Reference</label>
                  <input type="text" placeholder="ORD-2026-…" value={uploadOrderRef} onChange={(e) => setUploadOrderRef(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Net Amount (€)</label>
                  <input type="number" min="0" step="0.01" placeholder="0.00" value={uploadAmount} onChange={(e) => setUploadAmount(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Invoice (PDF)</label>
                <FileDropZone label="Upload your invoice PDF" hint="PDF only · max 10 MB" file={invoiceFile} onChange={setInvoiceFile} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Signed Client Feedback Form <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Ask the client contact to sign the feedback form after the assignment and upload it here. Payment cannot be released without it.</p>
                <FileDropZone
                  label="Upload signed client feedback form"
                  hint="PDF only · PDF only · Must be signed by the client"
                  file={uploadEvalFile}
                  onChange={setUploadEvalFile}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} disabled={tab === 'generate' ? !canGenerate : !canUpload}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white font-bold rounded-lg text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Submit Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Feedback form view modal ─────────────────────────────────────────────────
function FeedbackViewModal({ invoice, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Client Feedback Form</h3>
              <p className="text-xs text-gray-500">{invoice.num} · {invoice.orderRef}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors text-lg">✕</button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl mb-5">
          <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          <p className="text-sm font-semibold text-green-700">Signed feedback form received</p>
        </div>

        {/* File info */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-5">
          <div className="w-10 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{invoice.feedbackFile}</p>
            <p className="text-xs text-gray-400 mt-0.5">PDF · Uploaded {invoice.date}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50">Close</button>
          <button
            onClick={() => alert('PDF download will be available once connected to the backend.')}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white font-bold rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Invoice Card ─────────────────────────────────────────────────────────────
function InvoiceCard({ inv, onUploadFeedback, onViewFeedback }) {
  const locked = !inv.feedbackUploaded && inv.status !== 'paid' && inv.status !== 'cancelled';

  return (
    <div className={`bg-white border-2 rounded-xl p-5 flex flex-col gap-4 transition-all hover:shadow-md ${locked ? 'border-amber-200' : 'border-gray-200'}`}>

      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-bold text-gray-800">{inv.num}</span>
            {inv.type === 'generated' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">Auto-generated</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{inv.description}</p>
        </div>
        <StatusBadge status={inv.status} />
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-[11px] text-gray-400 font-medium">Base</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">€{inv.amount.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-[11px] text-gray-400 font-medium">Travel</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">€{inv.travel.toFixed(2)}</p>
        </div>
        <div className={`p-3 rounded-lg ${inv.status === 'paid' ? 'bg-green-50' : 'bg-gray-50'}`}>
          <p className="text-[11px] text-gray-400 font-medium">Total</p>
          <p className={`text-sm font-bold mt-0.5 ${inv.status === 'paid' ? 'text-green-700' : 'text-gray-800'}`}>€{inv.total.toFixed(2)}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
        <span>{inv.orderRef}</span>
        <span>Submitted {inv.date}</span>
        <span className={locked ? 'text-amber-600 font-medium' : ''}>Due {inv.due}</span>
      </div>

      {/* Evaluation status */}
      <div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-3">
        {inv.feedbackUploaded ? (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span className="text-xs font-semibold text-green-700">Client feedback form received</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            <span className="text-xs font-semibold text-amber-700">Client feedback form missing</span>
          </div>
        )}

        {inv.feedbackUploaded ? (
          <button
            onClick={() => onViewFeedback(inv)}
            className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            View form
          </button>
        ) : (
          <button onClick={() => onUploadFeedback(inv)}
            className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition-colors"
          >
            Upload feedback form
          </button>
        )}
      </div>

      {/* Settlement lock */}
      {locked && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
          <p className="text-xs text-amber-700">Payment is locked until the signed client feedback form is uploaded.</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FreelancerInvoicesPage() {
  const [invoices, setInvoices]           = useState(INIT_INVOICES);
  const [showSubmit, setShowSubmit]       = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [viewModal, setViewModal]         = useState(null);
  const [filter, setFilter]               = useState('all');

  const handleSubmitInvoice = (data) => {
    setInvoices((prev) => [{
      id: String(Date.now()),
      num: `INV-2026-${String(prev.length + 13).padStart(3, '0')}`,
      orderRef: data.orderRef,
      description: data.description,
      amount: data.amount,
      travel: data.travel,
      total: data.total,
      date: new Date().toISOString().slice(0, 10),
      due: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: 'pending',
      feedbackUploaded: !!data.feedbackFile,
      feedbackFile: data.feedbackFile ?? null,
      type: data.type,
    }, ...prev]);
  };

  const handleFeedbackSave = (invoiceId, fileName) => {
    setInvoices((prev) =>
      prev.map((inv) => inv.id === invoiceId ? { ...inv, feedbackUploaded: true, feedbackFile: fileName } : inv)
    );
  };

  const filtered     = filter === 'all' ? invoices : invoices.filter((i) => i.status === filter);
  const totalEarned  = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const missingFeedback = invoices.filter((i) => !i.feedbackUploaded && i.status !== 'paid' && i.status !== 'cancelled').length;

  return (
    <div className="min-h-screen bg-white p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">Submit invoices for completed assignments and track payment.</p>
        </div>
        <button onClick={() => setShowSubmit(true)}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
          Submit Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Invoices', value: invoices.length,                                                                   cls: 'text-gray-900'  },
          { label: 'Pending Review', value: invoices.filter((i) => i.status === 'pending' || i.status === 'on_hold').length,   cls: 'text-yellow-600' },
          { label: 'Paid',           value: invoices.filter((i) => i.status === 'paid').length,                                cls: 'text-green-600' },
          { label: 'Total Earned',   value: `€${totalEarned.toFixed(2)}`,                                                      cls: 'text-green-700' },
        ].map((s) => (
          <div key={s.label} className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-xl font-black mt-1 ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Missing evaluation banner */}
      {missingFeedback > 0 && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
          <p className="text-sm text-amber-800">
            <strong>{missingFeedback} invoice{missingFeedback > 1 ? 's are' : ' is'}</strong> missing the signed client feedback form — payment cannot be released until it is uploaded.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {[
          { key: 'all',      label: `All (${invoices.length})` },
          { key: 'pending',  label: 'Pending'  },
          { key: 'on_hold',  label: 'On Hold'  },
          { key: 'approved', label: 'Approved' },
          { key: 'paid',     label: 'Paid'     },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === f.key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <p className="font-semibold text-gray-500">No invoices found</p>
          <p className="text-sm text-gray-400 mt-1">Submit your first invoice to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((inv) => (
            <InvoiceCard key={inv.id} inv={inv} onUploadFeedback={setFeedbackModal} onViewFeedback={setViewModal} />
          ))}
        </div>
      )}

      {showSubmit    && <SubmitInvoiceModal onClose={() => setShowSubmit(false)} onSubmit={handleSubmitInvoice} />}
      {feedbackModal && <UploadFeedbackModal invoice={feedbackModal} onClose={() => setFeedbackModal(null)} onSave={handleFeedbackSave} />}
      {viewModal     && <FeedbackViewModal invoice={viewModal} onClose={() => setViewModal(null)} />}
    </div>
  );
}
