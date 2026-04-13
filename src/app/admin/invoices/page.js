'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_INVOICES = [
  { id: '1',  num: 'INV-2026-012', type: 'incoming', from: 'Sarah Ahmed',    initials: 'SA', amount: '€350.00', date: '2026-04-10', due: '2026-04-24', status: 'pending',  handledBy: null,  orderRef: 'ORD-2026-045', description: 'Nutrition Presentation – PharmaGroup GmbH',    fastbillId: null },
  { id: '2',  num: 'INV-2026-011', type: 'incoming', from: 'Peter Schulz',   initials: 'PS', amount: '€420.00', date: '2026-04-09', due: '2026-04-23', status: 'pending',  handledBy: null,  orderRef: 'ORD-2026-042', description: 'Workshop – Siemens AG',                         fastbillId: null },
  { id: '3',  num: 'INV-2026-010', type: 'incoming', from: 'Lisa Braun',     initials: 'LB', amount: '€180.00', date: '2026-04-07', due: '2026-04-21', status: 'on_hold',  handledBy: 'YL',  orderRef: 'ORD-2026-044', description: 'Survey Participation – TechCorp AG',           fastbillId: null },
  { id: '4',  num: 'INV-2026-009', type: 'incoming', from: 'Tom Brandt',     initials: 'TB', amount: '€290.00', date: '2026-04-05', due: '2026-04-19', status: 'approved', handledBy: 'MS',  orderRef: 'ORD-2026-041', description: 'Cardio Screening – Deutsche Telekom',          fastbillId: 'FB-8821' },
  { id: '5',  num: 'INV-2026-008', type: 'incoming', from: 'Alex Brown',     initials: 'AB', amount: '€220.00', date: '2026-04-02', due: '2026-04-16', status: 'paid',     handledBy: 'YL',  orderRef: 'ORD-2026-040', description: 'Marketing Evaluation – MediaGroup GmbH',      fastbillId: 'FB-8810' },
  { id: '6',  num: 'INV-2026-007', type: 'incoming', from: 'Julia Meier',    initials: 'JM', amount: '€160.00', date: '2026-03-30', due: '2026-04-13', status: 'cancelled',handledBy: 'YL',  orderRef: 'ORD-2026-039', description: 'Retail Audit – RetailPlus GmbH',               fastbillId: null },
  { id: '7',  num: 'INV-2026-006', type: 'incoming', from: 'Maria Hoffmann', initials: 'MH', amount: '€480.00', date: '2026-03-25', due: '2026-04-08', status: 'paid',     handledBy: 'MS',  orderRef: 'ORD-2026-038', description: 'Employee Wellness – Bosch GmbH',               fastbillId: 'FB-8798' },
  { id: '8',  num: 'INV-OUT-004',  type: 'outgoing', from: 'PharmaGroup GmbH',initials:'PG', amount: '€950.00', date: '2026-04-08', due: '2026-04-22', status: 'pending',  handledBy: 'YL',  orderRef: 'ORD-2026-045', description: 'Service Invoice – Nutrition Presentation',     fastbillId: 'FB-8830' },
  { id: '9',  num: 'INV-OUT-003',  type: 'outgoing', from: 'Siemens AG',     initials:'SI', amount: '€1,200.00',date: '2026-04-01', due: '2026-04-15', status: 'paid',     handledBy: 'MS',  orderRef: 'ORD-2026-043', description: 'Service Invoice – Presentation Review',       fastbillId: 'FB-8805' },
  { id: '10', num: 'INV-OUT-002',  type: 'outgoing', from: 'TechCorp AG',    initials:'TC', amount: '€750.00', date: '2026-03-20', due: '2026-04-03', status: 'paid',     handledBy: 'YL',  orderRef: 'ORD-2026-041', description: 'Service Invoice – Survey Participation',       fastbillId: 'FB-8790' },
];

const HANDLERS = [
  { code: 'YL', name: 'Yves Lubaki',   color: 'bg-green-600' },
  { code: 'MS', name: 'Maria Schmidt', color: 'bg-blue-600'  },
  { code: 'AK', name: 'Anna Koch',     color: 'bg-purple-600'},
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
function ActionModal({ modal, onClose, onConfirm, handlers }) {
  const [handler, setHandler] = useState(modal?.invoice?.handledBy ?? '');
  const [note, setNote] = useState('');

  if (!modal) return null;

  const config = {
    approve:  { title: 'Approve Invoice', sub: 'This will send the invoice to FastBill for processing.', btnCls: 'bg-blue-600 hover:bg-blue-700',   btnLabel: 'Approve',   icon: '✓', iconCls: 'bg-blue-100 text-blue-600'   },
    on_hold:  { title: 'Put on Hold',     sub: 'Flag this invoice for further review.',                  btnCls: 'bg-orange-500 hover:bg-orange-600',btnLabel: 'Put on Hold',icon: '⏸', iconCls: 'bg-orange-100 text-orange-600' },
    cancel:   { title: 'Cancel Invoice',  sub: 'This will permanently reject this invoice.',             btnCls: 'bg-red-600 hover:bg-red-700',      btnLabel: 'Cancel',    icon: '✕', iconCls: 'bg-red-100 text-red-600'      },
    mark_paid:{ title: 'Mark as Paid',    sub: 'Confirm this invoice has been paid via FastBill.',       btnCls: 'bg-green-700 hover:bg-green-800',  btnLabel: 'Mark Paid', icon: '€', iconCls: 'bg-green-100 text-green-700'  },
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

        {/* Invoice info */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 mb-5">
          <p className="text-xs font-mono text-gray-400">{modal.invoice.num}</p>
          <p className="font-bold text-gray-900 text-sm mt-0.5">{modal.invoice.description}</p>
          <p className="text-xs text-gray-500 mt-0.5">{modal.invoice.from} · {modal.invoice.amount}</p>
        </div>

        {/* Handler assignment */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Handled by</label>
          <select
            value={handler}
            onChange={(e) => setHandler(e.target.value)}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white text-sm"
          >
            <option value="">— Assign handler —</option>
            {handlers.map((h) => (
              <option key={h.code} value={h.code}>{h.name} ({h.code})</option>
            ))}
          </select>
        </div>

        {/* Note */}
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
            onClick={() => onConfirm(modal.invoice.id, modal.action, handler, note)}
            className={`flex-1 px-4 py-2.5 text-white font-bold rounded-lg text-sm transition-colors ${config.btnCls}`}
          >
            {config.btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Invoice Card ─────────────────────────────────────────────────────────────
function InvoiceCard({ inv, onAction }) {
  const needsAction = inv.status === 'pending' || inv.status === 'on_hold';

  return (
    <div className={`bg-white border-2 rounded-xl p-5 transition-all hover:shadow-md flex flex-col gap-4 ${
      needsAction ? 'border-yellow-200 hover:border-yellow-400' : 'border-gray-200 hover:border-green-400'
    }`}>
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-mono text-gray-400">{inv.num}</p>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inv.type === 'incoming' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
              {inv.type === 'incoming' ? '↓ In' : '↑ Out'}
            </span>
            {inv.fastbillId && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">FB</span>
            )}
          </div>
          <p className="text-sm font-bold text-gray-900 leading-snug">{inv.description}</p>
          <p className="text-xs text-gray-500 mt-0.5">{inv.from} · {inv.orderRef}</p>
        </div>
        <StatusBadge status={inv.status} />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        <span>Issued: <span className="font-semibold text-gray-700">{inv.date}</span></span>
        <span>Due: <span className={`font-semibold ${inv.status === 'pending' ? 'text-orange-600' : 'text-gray-700'}`}>{inv.due}</span></span>
        <span className="font-bold text-green-700 text-sm">{inv.amount}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
        {/* Handler badge */}
        <div className="flex items-center gap-2">
          {inv.handledBy ? (
            <>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${HANDLER_COLORS[inv.handledBy] ?? 'bg-gray-500'}`}>
                {inv.handledBy}
              </div>
              <span className="text-xs text-gray-500">Handled by {HANDLERS.find(h => h.code === inv.handledBy)?.name ?? inv.handledBy}</span>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">Unassigned</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Link href={`/admin/invoices/${inv.id}`}>
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="View">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </Link>
          {inv.status === 'pending' && (
            <>
              <button onClick={() => onAction(inv, 'approve')} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                Approve
              </button>
              <button onClick={() => onAction(inv, 'on_hold')} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-semibold rounded-lg transition-colors">
                Hold
              </button>
              <button onClick={() => onAction(inv, 'cancel')} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold rounded-lg transition-colors">
                Cancel
              </button>
            </>
          )}
          {inv.status === 'on_hold' && (
            <>
              <button onClick={() => onAction(inv, 'approve')} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                Approve
              </button>
              <button onClick={() => onAction(inv, 'cancel')} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold rounded-lg transition-colors">
                Cancel
              </button>
            </>
          )}
          {inv.status === 'approved' && (
            <button onClick={() => onAction(inv, 'mark_paid')} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-lg transition-colors">
              Mark Paid
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InvoicesPage() {
  const [invoices, setInvoices]   = useState(MOCK_INVOICES);
  const [tab, setTab]             = useState('all');       // all | incoming | outgoing
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState(null);

  const needsAction = invoices.filter((i) => i.status === 'pending' || i.status === 'on_hold').length;

  const filtered = invoices.filter((inv) => {
    const matchTab    = tab === 'all' || inv.type === tab;
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchSearch = inv.num.toLowerCase().includes(search.toLowerCase()) ||
                        inv.from.toLowerCase().includes(search.toLowerCase()) ||
                        inv.description.toLowerCase().includes(search.toLowerCase()) ||
                        inv.orderRef.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchStatus && matchSearch;
  });

  const handleAction = (invId, action, handler, note) => {
    const statusMap = { approve: 'approved', on_hold: 'on_hold', cancel: 'cancelled', mark_paid: 'paid' };
    setInvoices((prev) => prev.map((inv) =>
      inv.id === invId
        ? { ...inv, status: statusMap[action] ?? inv.status, handledBy: handler || inv.handledBy }
        : inv
    ));
    setModal(null);
  };

  // Stats
  const stats = [
    { label: 'Needs Action', value: invoices.filter(i => ['pending','on_hold'].includes(i.status)).length, cls: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
    { label: 'Approved',     value: invoices.filter(i => i.status === 'approved').length,  cls: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200'   },
    { label: 'Paid',         value: invoices.filter(i => i.status === 'paid').length,      cls: 'text-green-600',  bg: 'bg-green-50 border-green-200' },
    { label: 'Cancelled',    value: invoices.filter(i => i.status === 'cancelled').length, cls: 'text-red-600',    bg: 'bg-red-50 border-red-200'     },
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Invoices</h1>
          <p className="text-gray-600">Manage incoming &amp; outgoing invoices · FastBill connected</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/invoices/template">
            <button className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-700 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              Invoice Template
            </button>
          </Link>
        </div>
      </div>

      {/* FastBill notice */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-800">FastBill Integration Active</p>
          <p className="text-xs text-blue-600 mt-0.5">Approved invoices are automatically synced to FastBill. Once approved, payment can be triggered directly from FastBill. Invoices marked with <span className="font-bold">FB</span> are already linked.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.cls}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Type tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg shrink-0">
          {[
            { key: 'all',      label: 'All' },
            { key: 'incoming', label: '↓ Incoming' },
            { key: 'outgoing', label: '↑ Outgoing' },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search invoice, freelancer, order…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white text-sm shrink-0"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="on_hold">On Hold</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Needs-action banner */}
      {needsAction > 0 && statusFilter === 'all' && (
        <div className="mb-5 flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <span className="w-7 h-7 bg-yellow-400 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">{needsAction}</span>
          <p className="text-sm text-yellow-800 font-medium">
            {needsAction} invoice{needsAction !== 1 ? 's' : ''} require your attention — pending or on hold.
          </p>
          <button onClick={() => setStatusFilter('pending')} className="ml-auto text-xs font-bold text-yellow-700 hover:underline shrink-0">View pending</button>
        </div>
      )}

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No invoices found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((inv) => (
            <InvoiceCard key={inv.id} inv={inv} onAction={(inv, action) => setModal({ invoice: inv, action })} />
          ))}
        </div>
      )}

      <div className="mt-6 text-xs text-gray-400 text-right">{filtered.length} invoice{filtered.length !== 1 ? 's' : ''} shown</div>

      {/* Action Modal */}
      <ActionModal
        modal={modal}
        handlers={HANDLERS}
        onClose={() => setModal(null)}
        onConfirm={handleAction}
      />
    </div>
  );
}
