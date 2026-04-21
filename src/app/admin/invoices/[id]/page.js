'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// ─── Mock Data (shared with listing) ─────────────────────────────────────────
const MOCK_INVOICES = [
  { id: '1',  num: 'INV-2026-012', type: 'incoming', from: 'Sarah Ahmed',     initials: 'SA', amount: '€350.00',   amountRaw: 350,   date: '2026-04-10', due: '2026-04-24', status: 'pending',   handledBy: null,  orderRef: 'ORD-2026-045', description: 'Nutrition Presentation – PharmaGroup GmbH',  fastbillId: null,     feedbackFile: null, feedbackUploadedAt: null,     address: 'Musterstraße 12, 10115 Berlin', iban: 'DE89 3704 0044 0532 0130 00', bic: 'COBADEFFXXX', taxId: 'DE287654321', items: [{ desc: 'Nutrition Presentation (4h)', qty: 1, unit: '€350.00', total: '€350.00' }], subtotal: '€350.00', tax: '€66.50 (19%)', total: '€416.50', notes: '' },
  { id: '2',  num: 'INV-2026-011', type: 'incoming', from: 'Peter Schulz',    initials: 'PS', amount: '€420.00',   amountRaw: 420,   date: '2026-04-09', due: '2026-04-23', status: 'pending',   handledBy: null,  orderRef: 'ORD-2026-042', description: 'Workshop – Siemens AG',                       feedbackFile: null, feedbackUploadedAt: null,                       fastbillId: null,     address: 'Lindenweg 5, 20095 Hamburg',    iban: 'DE12 2004 1010 0505 0150 00', bic: 'COBADEFFXXX', taxId: 'DE287123456', items: [{ desc: 'Workshop facilitation (6h)', qty: 1, unit: '€420.00', total: '€420.00' }], subtotal: '€420.00', tax: '€79.80 (19%)', total: '€499.80', notes: '' },
  { id: '3',  num: 'INV-2026-010', type: 'incoming', from: 'Lisa Braun',      initials: 'LB', amount: '€180.00',   amountRaw: 180,   date: '2026-04-07', due: '2026-04-21', status: 'on_hold',   handledBy: 'YL',  orderRef: 'ORD-2026-044', description: 'Survey Participation – TechCorp AG',          feedbackFile: null, feedbackUploadedAt: null,          fastbillId: null,     address: 'Rosenstraße 8, 80331 München',  iban: 'DE21 7001 1110 0530 2200 00', bic: 'COBADEFFXXX', taxId: 'DE288765432', items: [{ desc: 'Survey facilitation (2h)', qty: 1, unit: '€180.00', total: '€180.00' }], subtotal: '€180.00', tax: '€34.20 (19%)', total: '€214.20', notes: 'Missing receipt for travel expenses.' },
  { id: '4',  num: 'INV-2026-009', type: 'incoming', from: 'Tom Brandt',      initials: 'TB', amount: '€290.00',   amountRaw: 290,   date: '2026-04-05', due: '2026-04-19', status: 'approved',  handledBy: 'MS',  orderRef: 'ORD-2026-041', description: 'Cardio Screening – Deutsche Telekom',         feedbackFile: 'feedback-DeutscheTelekom-ORD-2026-041.pdf', feedbackUploadedAt: '2026-04-06',         fastbillId: 'FB-8821',address: 'Bergstraße 22, 60313 Frankfurt',iban: 'DE57 5001 0517 0648 4898 90', bic: 'INGDDEFFXXX', taxId: 'DE289012345', items: [{ desc: 'Cardio screening (3h)', qty: 1, unit: '€290.00', total: '€290.00' }], subtotal: '€290.00', tax: '€55.10 (19%)', total: '€345.10', notes: '' },
  { id: '5',  num: 'INV-2026-008', type: 'incoming', from: 'Alex Brown',      initials: 'AB', amount: '€220.00',   amountRaw: 220,   date: '2026-04-02', due: '2026-04-16', status: 'paid',      handledBy: 'YL',  orderRef: 'ORD-2026-040', description: 'Marketing Evaluation – MediaGroup GmbH',     feedbackFile: 'feedback-MediaGroup-ORD-2026-040.pdf', feedbackUploadedAt: '2026-04-03',     fastbillId: 'FB-8810',address: 'Hauptstraße 3, 04109 Leipzig',  iban: 'DE87 3607 0024 0689 7315 00', bic: 'DEUTDEDBLEG', taxId: 'DE290123456', items: [{ desc: 'Marketing evaluation (2.5h)', qty: 1, unit: '€220.00', total: '€220.00' }], subtotal: '€220.00', tax: '€41.80 (19%)', total: '€261.80', notes: '' },
  { id: '6',  num: 'INV-2026-007', type: 'incoming', from: 'Julia Meier',     initials: 'JM', amount: '€160.00',   amountRaw: 160,   date: '2026-03-30', due: '2026-04-13', status: 'cancelled', handledBy: 'YL',  orderRef: 'ORD-2026-039', description: 'Retail Audit – RetailPlus GmbH',              fastbillId: null,     address: 'Schillerplatz 1, 70173 Stuttgart',iban:'DE91 6005 0101 7815 3869 87',bic: 'STUTTGARDXXX',taxId:'DE291234567',items: [{ desc: 'Retail audit (2h)', qty: 1, unit: '€160.00', total: '€160.00' }], subtotal: '€160.00', tax: '€30.40 (19%)', total: '€190.40', notes: 'Cancelled – freelancer did not complete the order.' },
  { id: '7',  num: 'INV-2026-006', type: 'incoming', from: 'Maria Hoffmann',  initials: 'MH', amount: '€480.00',   amountRaw: 480,   date: '2026-03-25', due: '2026-04-08', status: 'paid',      handledBy: 'MS',  orderRef: 'ORD-2026-038', description: 'Employee Wellness – Bosch GmbH',              fastbillId: 'FB-8798',address: 'Kaiserstraße 14, 76133 Karlsruhe',iban:'DE12 6601 0075 0515 8985 00',bic:'COBADEFFXXX',taxId:'DE292345678',items: [{ desc: 'Wellness workshop (full day)', qty: 1, unit: '€480.00', total: '€480.00' }], subtotal: '€480.00', tax: '€91.20 (19%)', total: '€571.20', notes: '' },
  { id: '8',  num: 'INV-OUT-004',  type: 'outgoing', from: 'PharmaGroup GmbH',initials: 'PG', amount: '€950.00',   amountRaw: 950,   date: '2026-04-08', due: '2026-04-22', status: 'pending',   handledBy: 'YL',  orderRef: 'ORD-2026-045', description: 'Service Invoice – Nutrition Presentation',    fastbillId: 'FB-8830',address: 'PharmaGroup GmbH, Am Promenadeplatz 6, 80333 München', iban: 'DE89 7000 0000 0123 4567 89', bic: 'COBADEFFXXX', taxId: '', items: [{ desc: 'Nutrition Presentation – Freelancer Service', qty: 1, unit: '€800.00', total: '€800.00' }, { desc: 'Platform service fee (18.75%)', qty: 1, unit: '€150.00', total: '€150.00' }], subtotal: '€950.00', tax: '€180.50 (19%)', total: '€1,130.50', notes: '' },
  { id: '9',  num: 'INV-OUT-003',  type: 'outgoing', from: 'Siemens AG',      initials: 'SI', amount: '€1,200.00', amountRaw: 1200,  date: '2026-04-01', due: '2026-04-15', status: 'paid',      handledBy: 'MS',  orderRef: 'ORD-2026-043', description: 'Service Invoice – Presentation Review',      fastbillId: 'FB-8805',address: 'Siemens AG, Werner-von-Siemens-Str. 1, 80333 München', iban: 'DE21 7001 1110 0530 2200 00', bic: 'COBADEFFXXX', taxId: '', items: [{ desc: 'Presentation Review – Freelancer Service', qty: 1, unit: '€1,010.00', total: '€1,010.00' }, { desc: 'Platform service fee (18.8%)', qty: 1, unit: '€190.00', total: '€190.00' }], subtotal: '€1,200.00', tax: '€228.00 (19%)', total: '€1,428.00', notes: 'Payment received on 2026-04-14.' },
  { id: '10', num: 'INV-OUT-002',  type: 'outgoing', from: 'TechCorp AG',     initials: 'TC', amount: '€750.00',   amountRaw: 750,   date: '2026-03-20', due: '2026-04-03', status: 'paid',      handledBy: 'YL',  orderRef: 'ORD-2026-041', description: 'Service Invoice – Survey Participation',      fastbillId: 'FB-8790',address: 'TechCorp AG, Frankfurter Allee 100, 10247 Berlin',   iban: 'DE57 5001 0517 0648 4898 90', bic: 'INGDDEFFXXX', taxId: '', items: [{ desc: 'Survey Participation – Freelancer Service', qty: 1, unit: '€630.00', total: '€630.00' }, { desc: 'Platform service fee (19%)', qty: 1, unit: '€120.00', total: '€120.00' }], subtotal: '€750.00', tax: '€142.50 (19%)', total: '€892.50', notes: '' },
];

const HANDLERS = [
  { code: 'YL', name: 'Yves Lubaki',   color: 'bg-green-600'  },
  { code: 'MS', name: 'Maria Schmidt', color: 'bg-blue-600'   },
  { code: 'AK', name: 'Anna Koch',     color: 'bg-purple-600' },
];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  on_hold:   { label: 'On Hold',   cls: 'bg-orange-100 text-orange-700 border-orange-200' },
  approved:  { label: 'Approved',  cls: 'bg-blue-100 text-blue-700 border-blue-200'       },
  paid:      { label: 'Paid',      cls: 'bg-green-100 text-green-700 border-green-200'    },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600 border-red-200'          },
};

const HANDLER_COLORS = { YL: 'bg-green-600', MS: 'bg-blue-600', AK: 'bg-purple-600' };

const INITIALS_COLORS = ['bg-green-600','bg-blue-600','bg-purple-600','bg-orange-500','bg-rose-600','bg-teal-600','bg-indigo-600','bg-pink-600'];
function avatarColor(str) {
  let h = 0; for (const c of str) h = c.charCodeAt(0) + h;
  return INITIALS_COLORS[h % INITIALS_COLORS.length];
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>{cfg.label}</span>
  );
}

// ─── Action Modal ─────────────────────────────────────────────────────────────
function ActionModal({ modal, onClose, onConfirm }) {
  const [handler, setHandler] = useState(modal?.invoice?.handledBy ?? '');
  const [note, setNote] = useState('');

  if (!modal) return null;

  const config = {
    approve:   { title: 'Approve Invoice',  sub: 'This will send the invoice to FastBill for processing.', btnCls: 'bg-blue-600 hover:bg-blue-700',    btnLabel: 'Approve',    icon: '✓', iconCls: 'bg-blue-100 text-blue-600'    },
    on_hold:   { title: 'Put on Hold',      sub: 'Flag this invoice for further review.',                  btnCls: 'bg-orange-500 hover:bg-orange-600', btnLabel: 'Put on Hold', icon: '⏸', iconCls: 'bg-orange-100 text-orange-600' },
    cancel:    { title: 'Cancel Invoice',   sub: 'This will permanently reject this invoice.',             btnCls: 'bg-red-600 hover:bg-red-700',       btnLabel: 'Cancel',     icon: '✕', iconCls: 'bg-red-100 text-red-600'      },
    mark_paid: { title: 'Mark as Paid',     sub: 'Confirm this invoice has been paid via FastBill.',       btnCls: 'bg-green-700 hover:bg-green-800',   btnLabel: 'Mark Paid',  icon: '€', iconCls: 'bg-green-100 text-green-700'  },
  }[modal.action];

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${config.iconCls}`}>
            {config.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{config.title}</h3>
            <p className="text-sm text-gray-500">{config.sub}</p>
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 mb-5">
          <p className="text-xs font-mono text-gray-400">{modal.invoice.num}</p>
          <p className="font-bold text-gray-900 text-sm mt-0.5">{modal.invoice.description}</p>
          <p className="text-xs text-gray-500 mt-0.5">{modal.invoice.from} · {modal.invoice.amount}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Handled by</label>
          <select
            value={handler}
            onChange={(e) => setHandler(e.target.value)}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white text-sm"
          >
            <option value="">— Assign handler —</option>
            {HANDLERS.map((h) => (
              <option key={h.code} value={h.code}>{h.name} ({h.code})</option>
            ))}
          </select>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Note <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this action…"
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm">Cancel</button>
          <button
            onClick={() => onConfirm(modal.action, handler, note)}
            className={`flex-1 px-4 py-2.5 text-white font-bold rounded-lg text-sm transition-colors ${config.btnCls}`}
          >
            {config.btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Timeline Entry ────────────────────────────────────────────────────────────
function TimelineEntry({ icon, iconBg, title, sub, time }) {
  return (
    <div className="flex gap-3">
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params?.id;

  // Find invoice from mock data (fall back to first if not found)
  const invoice = MOCK_INVOICES.find((inv) => inv.id === id) ?? MOCK_INVOICES[0];

  const [currentStatus, setCurrentStatus] = useState(invoice.status);
  const [currentHandler, setCurrentHandler] = useState(invoice.handledBy);
  const [feedbackFile, setFeedbackFile]     = useState(invoice.feedbackFile);
  const [feedbackDate, setFeedbackDate]     = useState(invoice.feedbackUploadedAt);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [modal, setModal] = useState(null);
  const [activityLog, setActivityLog] = useState([
    { icon: '📄', iconBg: 'bg-gray-100 text-gray-600', title: 'Invoice uploaded', sub: `${invoice.from} submitted this invoice`, time: invoice.date + ' 09:14' },
  ]);

  const handlerInfo = HANDLERS.find((h) => h.code === currentHandler);

  const openModal = (action) => setModal({ invoice: { ...invoice, status: currentStatus, handledBy: currentHandler }, action });
  const closeModal = () => setModal(null);
  const handleConfirm = (action, handler, note) => {
    const nextStatus = { approve: 'approved', on_hold: 'on_hold', cancel: 'cancelled', mark_paid: 'paid' }[action];
    if (handler) setCurrentHandler(handler);
    setCurrentStatus(nextStatus);
    const handlerName = HANDLERS.find((h) => h.code === handler)?.name ?? 'Unknown';
    setActivityLog((prev) => [
      ...prev,
      {
        icon: { approve: '✓', on_hold: '⏸', cancel: '✕', mark_paid: '€' }[action],
        iconBg: { approve: 'bg-blue-100 text-blue-600', on_hold: 'bg-orange-100 text-orange-600', cancel: 'bg-red-100 text-red-600', mark_paid: 'bg-green-100 text-green-700' }[action],
        title: { approve: 'Invoice approved', on_hold: 'Put on hold', cancel: 'Invoice cancelled', mark_paid: 'Marked as paid' }[action],
        sub: `By ${handlerName}${note ? ` · "${note}"` : ''}`,
        time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
    ]);
    setModal(null);
  };

  const canApprove  = currentStatus === 'pending' || currentStatus === 'on_hold';
  const canHold     = currentStatus === 'pending';
  const canCancel   = currentStatus === 'pending' || currentStatus === 'on_hold' || currentStatus === 'approved';
  const canMarkPaid = currentStatus === 'approved' && !!feedbackFile;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back */}
      <div className="mb-6">
        <Link href="/admin/invoices" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Invoices
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900">{invoice.num}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${invoice.type === 'incoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                {invoice.type === 'incoming' ? '↓ Incoming' : '↑ Outgoing'}
              </span>
              <StatusBadge status={currentStatus} />
              {invoice.fastbillId && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white tracking-wide">FB</span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">{invoice.description}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {canApprove  && <button onClick={() => openModal('approve')}  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Approve</button>}
          {canHold     && <button onClick={() => openModal('on_hold')}  className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">Hold</button>}
          {currentStatus === 'approved' && (
            <button
              onClick={() => feedbackFile ? openModal('mark_paid') : null}
              title={!feedbackFile ? 'Client feedback form required before marking as paid' : ''}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${feedbackFile ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {!feedbackFile && <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
              Mark Paid
            </button>
          )}
          {canCancel   && <button onClick={() => openModal('cancel')}   className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">Cancel</button>}
          <button
            onClick={() => window.open(`/invoice-print/${invoice.id}`, '_blank')}
            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* On hold warning */}
      {currentStatus === 'on_hold' && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <svg className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-orange-800">Invoice is on hold</p>
            {invoice.notes && <p className="text-sm text-orange-700 mt-0.5">{invoice.notes}</p>}
          </div>
        </div>
      )}

      {/* Cancelled notice */}
      {currentStatus === 'cancelled' && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">Invoice cancelled</p>
            {invoice.notes && <p className="text-sm text-red-700 mt-0.5">{invoice.notes}</p>}
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column — invoice preview + line items */}
        <div className="lg:col-span-2 space-y-6">

          {/* Invoice document preview */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
            {/* Doc header */}
            <div className="bg-gray-50 border-b border-gray-200 px-8 py-6 flex justify-between items-start">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {invoice.type === 'incoming' ? 'Invoice from Freelancer' : 'Invoice to Client'}
                </div>
                <h2 className="text-2xl font-black text-gray-900">{invoice.num}</h2>
                {invoice.fastbillId && (
                  <p className="text-xs text-indigo-600 font-semibold mt-1">FastBill ID: {invoice.fastbillId}</p>
                )}
              </div>
              <div className="text-right text-sm text-gray-600">
                <p><span className="font-semibold">Date:</span> {invoice.date}</p>
                <p className="mt-0.5"><span className="font-semibold">Due:</span> {invoice.due}</p>
                <p className="mt-0.5">
                  <span className="font-semibold">Order:</span>{' '}
                  <Link href={`/admin/orders/${encodeURIComponent(invoice.orderRef)}`} className="text-green-700 hover:underline">
                    {invoice.orderRef}
                  </Link>
                </p>
              </div>
            </div>

            <div className="px-8 py-6">
              {/* From / To */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    {invoice.type === 'incoming' ? 'From' : 'Bill To'}
                  </p>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${avatarColor(invoice.from)}`}>
                      {invoice.initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{invoice.from}</p>
                      <p className="text-xs text-gray-500">{invoice.type === 'incoming' ? 'Freelancer' : 'Client'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{invoice.address}</p>
                  {invoice.taxId && <p className="text-xs text-gray-400 mt-1">Tax ID: {invoice.taxId}</p>}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    {invoice.type === 'incoming' ? 'Bill To' : 'From'}
                  </p>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      FH
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">FreelanceHub GmbH</p>
                      <p className="text-xs text-gray-500">Platform operator</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">Unter den Linden 10, 10117 Berlin</p>
                  <p className="text-xs text-gray-400 mt-1">Tax ID: DE123456789</p>
                </div>
              </div>

              {/* Line items table */}
              <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Description</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Qty</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Unit Price</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3 text-gray-800 font-medium">{item.desc}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{item.qty}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{item.unit}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{invoice.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>VAT {invoice.tax.split('(')[1]?.replace(')', '') ?? '19%'}</span>
                    <span className="font-medium">{invoice.tax.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t-2 border-gray-900">
                    <span>Total</span>
                    <span>{invoice.total}</span>
                  </div>
                </div>
              </div>

              {/* Bank details (incoming only) */}
              {invoice.type === 'incoming' && invoice.iban && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bank Details</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">IBAN</p>
                      <p className="font-mono font-medium text-gray-800">{invoice.iban}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">BIC/SWIFT</p>
                      <p className="font-mono font-medium text-gray-800">{invoice.bic}</p>
                    </div>
                  </div>
                </div>
              )}

              {invoice.notes && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs font-bold text-yellow-700 mb-1">Notes</p>
                  <p className="text-sm text-yellow-800">{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column — meta + activity */}
        <div className="space-y-6">

          {/* Status & Handler card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Invoice Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <StatusBadge status={currentStatus} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${invoice.type === 'incoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                  {invoice.type === 'incoming' ? '↓ Incoming' : '↑ Outgoing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-sm font-bold text-gray-900">{invoice.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Invoice date</span>
                <span className="text-sm text-gray-700">{invoice.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Due date</span>
                <span className={`text-sm font-medium ${currentStatus === 'pending' || currentStatus === 'on_hold' ? 'text-orange-600' : 'text-gray-700'}`}>{invoice.due}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Order ref.</span>
                <Link href={`/admin/orders/${encodeURIComponent(invoice.orderRef)}`} className="text-sm font-medium text-green-700 hover:underline">
                  {invoice.orderRef}
                </Link>
              </div>
              {invoice.fastbillId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">FastBill</span>
                  <span className="text-sm font-mono text-indigo-600 font-medium">{invoice.fastbillId}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Handler</span>
                  {handlerInfo ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${handlerInfo.color}`}>
                        {handlerInfo.code}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{handlerInfo.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions card */}
          {(canApprove || canHold || canMarkPaid || canCancel) && (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Actions</h3>
              <div className="space-y-2">
                {canApprove  && <button onClick={() => openModal('approve')}  className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors text-left flex items-center gap-2"><span>✓</span> Approve Invoice</button>}
                {canHold     && <button onClick={() => openModal('on_hold')}  className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors text-left flex items-center gap-2"><span>⏸</span> Put on Hold</button>}
                {currentStatus === 'approved' && (
                  <button
                    onClick={() => feedbackFile ? openModal('mark_paid') : null}
                    title={!feedbackFile ? 'Client feedback form required before marking as paid' : ''}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left flex items-center gap-2 ${feedbackFile ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                    {feedbackFile ? 'Mark as Paid' : 'Mark as Paid (awaiting feedback form)'}
                  </button>
                )}
                {canCancel   && <button onClick={() => openModal('cancel')}   className="w-full px-4 py-2.5 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors text-left flex items-center gap-2"><span>✕</span> Cancel Invoice</button>}
              </div>
            </div>
          )}

          {/* Client Feedback Form card */}
          {invoice.type === 'incoming' && (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Client Feedback Form</h3>
              {feedbackFile ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    <span className="text-sm font-semibold">Form received</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="w-9 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{feedbackFile}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Uploaded {feedbackDate}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('PDF download available once connected to backend.')}
                    className="w-full px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download PDF
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                    <p className="text-xs text-amber-700">No feedback form uploaded yet. Invoice cannot be marked as paid until received.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity timeline */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Activity</h3>
            <div className="space-y-1">
              {activityLog.map((entry, i) => (
                <TimelineEntry key={i} {...entry} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Action modal */}
      {modal && (
        <ActionModal modal={modal} onClose={closeModal} onConfirm={handleConfirm} />
      )}
    </div>
  );
}
