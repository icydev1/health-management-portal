'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: 'ORD-2026-045',
    title: 'Nutrition Presentation',
    company: 'PharmaGroup GmbH',
    city: 'Munich',
    date: '2026-05-06',
    time: '14:00',
    products: ['Presentation – 60 minutes'],
    fee: '€350',
    status: 'Assigned',
  },
  {
    id: 'ORD-2026-049',
    title: 'Cardio & Vital Screening Day',
    company: 'Bosch GmbH',
    city: 'Bremen',
    date: '2026-04-28',
    time: '08:00',
    products: ['CardioCheck', 'Vital Screening'],
    fee: '€500',
    status: 'Open',
  },
  {
    id: 'ORD-2026-050',
    title: 'Workplace Health Workshop',
    company: 'Siemens AG',
    city: 'Hamburg',
    date: '2026-04-22',
    time: '09:00',
    products: ['Workshop – 90 minutes'],
    fee: '€420',
    status: 'Open',
  },
];

const MOCK_APPLICATIONS = [
  { id: 1, orderId: 'ORD-2026-045', freelancerName: 'Sarah Ahmed',    freelancerEmail: 'sarah.ahmed@example.com',   freelancerRegion: 'BAYERN',     freelancerInitials: 'SA', appliedAt: '2026-04-08 09:14', note: 'I have experience with nutrition topics and have done similar presentations for pharma companies before.', status: 'accepted' },
  { id: 2, orderId: 'ORD-2026-045', freelancerName: 'Klaus Weber',     freelancerEmail: 'k.weber@example.com',       freelancerRegion: 'BAYERN',     freelancerInitials: 'KW', appliedAt: '2026-04-08 11:32', note: '', status: 'rejected' },
  { id: 3, orderId: 'ORD-2026-045', freelancerName: 'Maria Hoffmann',  freelancerEmail: 'm.hoffmann@example.com',    freelancerRegion: 'BAYERN',     freelancerInitials: 'MH', appliedAt: '2026-04-09 08:05', note: 'Available and fully equipped. Happy to travel.', status: 'rejected' },
  { id: 4, orderId: 'ORD-2026-049', freelancerName: 'Tom Brandt',      freelancerEmail: 't.brandt@example.com',      freelancerRegion: 'NORD_WEST',  freelancerInitials: 'TB', appliedAt: '2026-04-07 14:20', note: 'Certified for all listed screenings.', status: 'pending' },
  { id: 5, orderId: 'ORD-2026-049', freelancerName: 'Lisa Braun',      freelancerEmail: 'l.braun@example.com',       freelancerRegion: 'NORD_WEST',  freelancerInitials: 'LB', appliedAt: '2026-04-07 16:45', note: '', status: 'pending' },
  { id: 6, orderId: 'ORD-2026-049', freelancerName: 'Anna Schneider',  freelancerEmail: 'a.schneider@example.com',   freelancerRegion: 'NORD_WEST',  freelancerInitials: 'AS', appliedAt: '2026-04-08 10:10', note: 'I worked with Bosch last year, great team.', status: 'pending' },
  { id: 7, orderId: 'ORD-2026-050', freelancerName: 'Peter Schulz',    freelancerEmail: 'p.schulz@example.com',      freelancerRegion: 'NORD_WEST',  freelancerInitials: 'PS', appliedAt: '2026-04-06 10:00', note: 'Workshop specialist with 5+ years experience.', status: 'pending' },
  { id: 8, orderId: 'ORD-2026-050', freelancerName: 'Julia Meier',     freelancerEmail: 'j.meier@example.com',       freelancerRegion: 'NORD_WEST',  freelancerInitials: 'JM', appliedAt: '2026-04-07 09:30', note: '', status: 'pending' },
];

const REGION_LABELS = {
  NORD_WEST: 'North West',
  BAYERN: 'Bayern',
  BERLIN_BRANDENBURG: 'Berlin / Brandenburg',
  SACHSEN: 'Sachsen',
};

const INITIALS_COLORS = ['bg-green-600','bg-blue-600','bg-purple-600','bg-orange-500','bg-rose-600','bg-teal-600','bg-indigo-600','bg-pink-600'];
function avatarColor(name) {
  let h = 0; for (const c of name) h = c.charCodeAt(0) + h;
  return INITIALS_COLORS[h % INITIALS_COLORS.length];
}

function StatusBadge({ status }) {
  const M = {
    pending:  'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${M[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

// ─── Single Order View ────────────────────────────────────────────────────────
function OrderApplications({ order, applications, onBack, onAction }) {
  const counts = {
    all:      applications.length,
    pending:  applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };
  const [filter, setFilter] = useState('all');

  const filtered = applications.filter((a) => filter === 'all' || a.status === filter);

  return (
    <div>
      {/* Order info card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-5 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-1">{order.id}</p>
            <h2 className="text-xl font-bold text-gray-900">{order.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{order.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              order.status === 'Assigned'  ? 'bg-green-100 text-green-700' :
              order.status === 'Open'      ? 'bg-blue-100 text-blue-700' :
              order.status === 'Completed' ? 'bg-green-600 text-white' :
              'bg-gray-100 text-gray-600'
            }`}>{order.status}</span>
            <Link href={`/admin/orders/edit?id=${order.id}`}>
              <button className="text-xs font-semibold text-green-700 border border-green-300 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
                Edit Order
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
            {order.date} · {order.time}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            {order.city}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Fee: {order.fee}
          </span>
          <span className="text-gray-500">{order.products.join(' · ')}</span>
        </div>
      </div>

      {/* Count pills + filter */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {[
          { key: 'all',      label: 'All',      cls: 'bg-gray-100 text-gray-700' },
          { key: 'pending',  label: 'Pending',  cls: 'bg-yellow-100 text-yellow-700' },
          { key: 'accepted', label: 'Accepted', cls: 'bg-green-100 text-green-700' },
          { key: 'rejected', label: 'Rejected', cls: 'bg-red-100 text-red-600' },
        ].map((s) => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border-2 ${
              filter === s.key ? 'border-green-600 shadow-sm' : 'border-transparent'
            } ${s.cls}`}>
            {s.label} · {counts[s.key]}
          </button>
        ))}
      </div>

      {/* Application cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No {filter !== 'all' ? filter : ''} applications.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ApplicationCard key={app.id} app={app} onAction={onAction} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ app, onAction }) {
  const [confirmAction, setConfirmAction] = useState(null);

  const doAction = (action) => {
    setConfirmAction(null);
    onAction(app.id, action);
  };

  return (
    <div className={`bg-white rounded-xl border-2 transition-all ${
      app.status === 'accepted' ? 'border-green-300 bg-green-50/40' :
      app.status === 'rejected' ? 'border-gray-200 opacity-70' :
      'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${avatarColor(app.freelancerName)}`}>
          {app.freelancerInitials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="font-bold text-gray-900">{app.freelancerName}</p>
            <StatusBadge status={app.status} />
          </div>
          <p className="text-sm text-gray-500">{app.freelancerEmail}</p>
          <p className="text-xs text-gray-400 mt-0.5">{REGION_LABELS[app.freelancerRegion] ?? app.freelancerRegion} · Applied {app.appliedAt}</p>

          {app.note && (
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 italic">
              "{app.note}"
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0 sm:items-end">
          {app.status === 'pending' && (
            <>
              {confirmAction ? (
                <div className="flex flex-col gap-2 items-end">
                  <p className="text-xs text-gray-500 text-right max-w-[160px]">
                    {confirmAction === 'accept'
                      ? 'Accept this freelancer? Others will be auto-rejected.'
                      : 'Reject this application?'}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmAction(null)}
                      className="px-3 py-1.5 text-xs border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold">
                      Cancel
                    </button>
                    <button onClick={() => doAction(confirmAction)}
                      className={`px-3 py-1.5 text-xs text-white rounded-lg font-semibold ${confirmAction === 'accept' ? 'bg-green-700 hover:bg-green-800' : 'bg-red-600 hover:bg-red-700'}`}>
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setConfirmAction('accept')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accept
                  </button>
                  <button onClick={() => setConfirmAction('reject')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                </div>
              )}
            </>
          )}

          {app.status === 'accepted' && (
            <div className="flex items-center gap-1.5 text-green-700 font-semibold text-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Assigned
            </div>
          )}

          {app.status === 'rejected' && (
            <button onClick={() => onAction(app.id, 'pending')}
              className="px-3 py-1.5 border-2 border-gray-300 text-gray-500 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-colors">
              Reconsider
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── All Orders Overview ──────────────────────────────────────────────────────
function AllOrdersOverview({ applications, orders, onSelectOrder }) {
  return (
    <div className="space-y-4">
      {MOCK_ORDERS.map((order) => {
        const apps = applications.filter((a) => a.orderId === order.id);
        const pending  = apps.filter((a) => a.status === 'pending').length;
        const accepted = apps.filter((a) => a.status === 'accepted').length;
        if (!apps.length) return null;
        return (
          <button key={order.id} onClick={() => onSelectOrder(order.id)}
            className="w-full text-left bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-md transition-all p-5 group">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-mono text-gray-400 mb-1">{order.id}</p>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors">{order.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{order.company} · {order.city} · {order.date}</p>
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    {pending > 0 && (
                      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        {pending} pending
                      </span>
                    )}
                    {accepted > 0 && (
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {accepted} accepted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function ApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') ?? '';

  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [selectedOrderId, setSelectedOrderId] = useState(queryId || null);

  const selectedOrder = MOCK_ORDERS.find((o) => o.id === selectedOrderId) ?? null;
  const orderApps = selectedOrderId ? applications.filter((a) => a.orderId === selectedOrderId) : [];

  const handleAction = (appId, action) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) return { ...a, status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : action };
        // Auto-reject others in same order when accepting
        if (action === 'accept') {
          const target = prev.find((x) => x.id === appId);
          if (a.orderId === target?.orderId && a.id !== appId && a.status === 'pending') {
            return { ...a, status: 'rejected' };
          }
        }
        return a;
      })
    );
  };

  const totalPending = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => { if (selectedOrderId) { setSelectedOrderId(null); } else { router.push('/admin/orders'); } }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5 font-semibold text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {selectedOrderId ? 'Back to All Applications' : 'Back to Orders'}
        </button>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">
              {selectedOrder ? 'Applications' : 'Freelancer Applications'}
            </h1>
            <p className="text-gray-500 text-sm">
              {selectedOrder
                ? `${orderApps.length} application${orderApps.length !== 1 ? 's' : ''} for this order`
                : 'Select an order to review its applications'}
            </p>
          </div>
          {!selectedOrder && totalPending > 0 && (
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-sm">
              {totalPending} pending review
            </span>
          )}
        </div>
      </div>

      {selectedOrder ? (
        <OrderApplications
          order={selectedOrder}
          applications={orderApps}
          onBack={() => setSelectedOrderId(null)}
          onAction={handleAction}
        />
      ) : (
        <AllOrdersOverview
          applications={applications}
          orders={MOCK_ORDERS}
          onSelectOrder={setSelectedOrderId}
        />
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense>
      <ApplicationsContent />
    </Suspense>
  );
}
