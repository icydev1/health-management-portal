'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    orderNum: 'DRF-2026-003',
    title: 'Bosch GmbH – Workshop + Cardioscan',
    company: 'Bosch GmbH',
    city: 'Bremen',
    date: '2026-04-22',
    time: '09:00',
    products: ['Workshop – 90 minutes', 'CardioCheck'],
    fee: '€650',
    travelAllowance: '€30',
    freelancer: '',
    status: 'Draft',
    progress: 0,
    contactPerson: 'Hans Berger',
    contactEmail: 'h.berger@bosch.com',
    contactPhone: '+49 421 8870',
    notes: 'Two-part session: workshop in the morning, cardio screening in the afternoon.',
  },
  {
    orderNum: 'ORD-2026-045',
    title: 'Product Evaluation - North Region',
    company: 'PharmaGroup GmbH',
    city: 'Munich',
    date: '2026-03-05',
    time: '14:00',
    products: ['Presentation – 60 minutes'],
    fee: '€150',
    travelAllowance: '€20',
    freelancer: 'Sarah Ahmed',
    status: 'Assigned',
    progress: 60,
    contactPerson: 'Anna Müller',
    contactEmail: 'a.mueller@pharmagroup.de',
    contactPhone: '+49 89 4321 100',
    notes: 'Please arrive 30 minutes early to set up.',
  },
  {
    orderNum: 'ORD-2026-044',
    title: 'Survey Participation - Tech',
    company: 'TechCorp AG',
    city: 'Hamburg',
    date: '2026-03-04',
    time: '10:00',
    products: ['Survey – 45 minutes'],
    fee: '€200',
    travelAllowance: '€25',
    freelancer: '',
    status: 'Open',
    progress: 0,
    contactPerson: 'Stefan Koch',
    contactEmail: 's.koch@techcorp.de',
    contactPhone: '+49 40 7654 200',
    notes: '',
  },
  {
    orderNum: 'ORD-2026-043',
    title: 'Presentation Review',
    company: 'Siemens AG',
    city: 'Berlin',
    date: '2026-02-28',
    time: '11:00',
    products: ['Presentation – 60 minutes'],
    fee: '€180',
    travelAllowance: '€15',
    freelancer: 'Jessica Park',
    status: 'Completed',
    progress: 100,
    contactPerson: 'Eva Richter',
    contactEmail: 'e.richter@siemens.de',
    contactPhone: '+49 30 5566 300',
    notes: '',
  },
  {
    orderNum: 'ORD-2026-042',
    title: 'Marketing Campaign Evaluation',
    company: 'MediaGroup GmbH',
    city: 'Cologne',
    date: '2026-03-02',
    time: '13:00',
    products: ['Workshop – 60 minutes'],
    fee: '€220',
    travelAllowance: '€30',
    freelancer: 'Alex Brown',
    status: 'Assigned',
    progress: 75,
    contactPerson: 'Laura Becker',
    contactEmail: 'l.becker@mediagroup.de',
    contactPhone: '+49 221 9988 400',
    notes: 'Focus on Spring campaign materials.',
  },
  {
    orderNum: 'ORD-2026-041',
    title: 'Customer Feedback Collection',
    company: 'RetailPlus GmbH',
    city: 'Frankfurt',
    date: '2026-02-27',
    time: '09:00',
    products: ['Feedback Survey'],
    fee: '€100',
    travelAllowance: '€10',
    freelancer: '',
    status: 'Cancelled',
    progress: 0,
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    notes: 'Cancelled due to client request.',
  },
];

const MOCK_APPLICATIONS = [
  { id: 1, orderId: 'ORD-2026-045', freelancerId: '1', freelancerName: 'Sarah Ahmed',   freelancerEmail: 'sarah.ahmed@example.com',  freelancerRegion: 'BAYERN',    freelancerInitials: 'SA', appliedAt: '2026-04-08 09:14', note: 'I have experience with nutrition topics and have done similar presentations for pharma companies before.', status: 'accepted' },
  { id: 2, orderId: 'ORD-2026-045', freelancerId: '3', freelancerName: 'Klaus Weber',    freelancerEmail: 'k.weber@example.com',      freelancerRegion: 'BAYERN',    freelancerInitials: 'KW', appliedAt: '2026-04-08 11:32', note: '', status: 'rejected' },
  { id: 3, orderId: 'ORD-2026-045', freelancerId: '4', freelancerName: 'Maria Hoffmann', freelancerEmail: 'm.hoffmann@example.com',   freelancerRegion: 'BAYERN',    freelancerInitials: 'MH', appliedAt: '2026-04-09 08:05', note: 'Available and fully equipped. Happy to travel.', status: 'rejected' },
  { id: 4, orderId: 'ORD-2026-044', freelancerId: '5', freelancerName: 'Tom Brandt',     freelancerEmail: 't.brandt@example.com',     freelancerRegion: 'NORD_WEST', freelancerInitials: 'TB', appliedAt: '2026-04-07 14:20', note: 'Certified for all listed screenings.', status: 'pending' },
  { id: 5, orderId: 'ORD-2026-044', freelancerId: '6', freelancerName: 'Lisa Braun',     freelancerEmail: 'l.braun@example.com',      freelancerRegion: 'NORD_WEST', freelancerInitials: 'LB', appliedAt: '2026-04-07 16:45', note: '', status: 'pending' },
  { id: 6, orderId: 'ORD-2026-044', freelancerId: '7', freelancerName: 'Anna Schneider', freelancerEmail: 'a.schneider@example.com',  freelancerRegion: 'NORD_WEST', freelancerInitials: 'AS', appliedAt: '2026-04-08 10:10', note: 'I worked with a similar client last year.', status: 'pending' },
  { id: 7, orderId: 'ORD-2026-042', freelancerId: '8', freelancerName: 'Peter Schulz',   freelancerEmail: 'p.schulz@example.com',     freelancerRegion: 'NORD_WEST', freelancerInitials: 'PS', appliedAt: '2026-04-06 10:00', note: 'Workshop specialist with 5+ years experience.', status: 'pending' },
  { id: 8, orderId: 'ORD-2026-042', freelancerId: '2', freelancerName: 'Julia Meier',    freelancerEmail: 'j.meier@example.com',      freelancerRegion: 'NORD_WEST', freelancerInitials: 'JM', appliedAt: '2026-04-07 09:30', note: '', status: 'pending' },
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStatusColor(status) {
  switch (status) {
    case 'Draft':     return 'bg-yellow-100 text-yellow-700';
    case 'Open':      return 'bg-blue-100 text-blue-700';
    case 'Assigned':  return 'bg-green-100 text-green-700';
    case 'Completed': return 'bg-green-600 text-white';
    case 'Cancelled': return 'bg-red-100 text-red-700';
    default:          return 'bg-gray-100 text-gray-700';
  }
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-4 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide sm:w-40 shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{value || '—'}</span>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700">
          {icon}
        </div>
        <h2 className="font-bold text-gray-900">{title}</h2>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );
}

// ─── Application Card ─────────────────────────────────────────────────────────
function AppStatusBadge({ status }) {
  const M = {
    pending:  'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${M[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ApplicationCard({ app, onOpenModal, onAction }) {
  return (
    <div className={`bg-white rounded-xl border-2 transition-all ${
      app.status === 'accepted' ? 'border-green-300 bg-green-50/40' :
      app.status === 'rejected' ? 'border-gray-200 opacity-70' :
      'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Avatar */}
        <Link href={`/admin/freelancers/${app.freelancerId}`} className="shrink-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold hover:ring-2 hover:ring-green-500 hover:ring-offset-1 transition-all cursor-pointer ${avatarColor(app.freelancerName)}`}>
            {app.freelancerInitials}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <Link href={`/admin/freelancers/${app.freelancerId}`}>
              <span className="font-bold text-gray-900 hover:text-green-700 hover:underline cursor-pointer transition-colors">
                {app.freelancerName}
              </span>
            </Link>
            <AppStatusBadge status={app.status} />
          </div>
          <p className="text-sm text-gray-500">{app.freelancerEmail}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {REGION_LABELS[app.freelancerRegion] ?? app.freelancerRegion} · Applied {app.appliedAt}
          </p>
          {app.note && (
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 italic">
              "{app.note}"
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0 sm:items-end">
          {app.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => onOpenModal(app, 'accept')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accept
              </button>
              <button
                onClick={() => onOpenModal(app, 'reject')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            </div>
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
            <button
              onClick={() => onAction(app.id, 'pending')}
              className="px-3 py-1.5 border-2 border-gray-300 text-gray-500 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-colors"
            >
              Reconsider
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ modal, onClose, onConfirm }) {
  if (!modal) return null;
  const isAccept = modal.action === 'accept';

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        {/* Icon + Title */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isAccept ? 'bg-green-100' : 'bg-red-100'}`}>
            {isAccept ? (
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {isAccept ? 'Accept Application' : 'Reject Application'}
            </h3>
            <p className="text-sm text-gray-500">
              {isAccept ? 'Assign this freelancer to the order' : 'Decline this application'}
            </p>
          </div>
        </div>

        {/* Freelancer info */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${avatarColor(modal.app.freelancerName)}`}>
            {modal.app.freelancerInitials}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{modal.app.freelancerName}</p>
            <p className="text-xs text-gray-500">{modal.app.freelancerEmail}</p>
            <p className="text-xs text-gray-400">{REGION_LABELS[modal.app.freelancerRegion] ?? modal.app.freelancerRegion}</p>
          </div>
        </div>

        {/* Warning for accept */}
        {isAccept && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-5">
            <svg className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-yellow-700">
              All other pending applications for this order will be <strong>automatically rejected</strong>.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-white font-bold rounded-lg transition-colors text-sm ${
              isAccept ? 'bg-green-700 hover:bg-green-800' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAccept ? 'Yes, Accept' : 'Yes, Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const orderNum = decodeURIComponent(id ?? '');

  const order = MOCK_ORDERS.find((o) => o.orderNum === orderNum);
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [appFilter, setAppFilter] = useState('all');
  const [modal, setModal] = useState(null); // { app, action }

  const openModal  = (app, action) => setModal({ app, action });
  const closeModal = () => setModal(null);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Order not found.</p>
        <Link href="/admin/orders">
          <button className="text-sm font-semibold text-green-700 hover:underline">Back to Orders</button>
        </Link>
      </div>
    );
  }

  const orderApps = applications.filter((a) => a.orderId === orderNum);
  const counts = {
    all:      orderApps.length,
    pending:  orderApps.filter((a) => a.status === 'pending').length,
    accepted: orderApps.filter((a) => a.status === 'accepted').length,
    rejected: orderApps.filter((a) => a.status === 'rejected').length,
  };
  const filteredApps = orderApps.filter((a) => appFilter === 'all' || a.status === appFilter);

  const handleAction = (appId, action) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) return { ...a, status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : action };
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

  const handleModalConfirm = () => {
    if (!modal) return;
    handleAction(modal.app.id, modal.action);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-semibold text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Orders
      </button>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-xs font-mono text-gray-400 mb-1">{order.orderNum}</p>
          <h1 className="text-3xl font-bold text-gray-900">{order.title}</h1>
          <p className="text-gray-500 mt-1">{order.company} · {order.city}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <Link href={`/admin/orders/edit?id=${order.orderNum}`}>
            <button className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Order
            </button>
          </Link>
        </div>
      </div>

      <div className="space-y-5">

        {/* Order Details + Company side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Order Details */}
          <Section title="Order Details" icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }>
            <InfoRow label="Date" value={order.date} />
            <InfoRow label="Time" value={order.time} />
            <InfoRow label="Products" value={order.products.join(', ')} />
            <InfoRow label="Fee" value={order.fee} />
            <InfoRow label="Travel Allowance" value={order.travelAllowance} />
            <InfoRow label="Assigned Freelancer" value={order.freelancer} />
            <InfoRow label="Progress" value={`${order.progress}%`} />
          </Section>

          {/* Company / Contact */}
          <Section title="Company & Contact" icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          }>
            <InfoRow label="Company" value={order.company} />
            <InfoRow label="City" value={order.city} />
            <InfoRow label="Contact Person" value={order.contactPerson} />
            <InfoRow label="Email" value={order.contactEmail} />
            <InfoRow label="Phone" value={order.contactPhone} />
          </Section>

        </div>

        {/* Notes */}
        {order.notes && (
          <Section title="Notes" icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
          }>
            <div className="py-3">
              <p className="text-sm text-gray-700 whitespace-pre-line">{order.notes}</p>
            </div>
          </Section>
        )}

        {/* Applications */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h2 className="font-bold text-gray-900">Freelancer Applications</h2>
            </div>
            {counts.pending > 0 && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                {counts.pending} pending review
              </span>
            )}
          </div>

          <div className="px-5 py-4">
            {/* Filter pills */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {[
                { key: 'all',      label: 'All',      cls: 'bg-gray-100 text-gray-700' },
                { key: 'pending',  label: 'Pending',  cls: 'bg-yellow-100 text-yellow-700' },
                { key: 'accepted', label: 'Accepted', cls: 'bg-green-100 text-green-700' },
                { key: 'rejected', label: 'Rejected', cls: 'bg-red-100 text-red-600' },
              ].map((s) => (
                <button key={s.key} onClick={() => setAppFilter(s.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border-2 ${
                    appFilter === s.key ? 'border-green-600 shadow-sm' : 'border-transparent'
                  } ${s.cls}`}>
                  {s.label} · {counts[s.key]}
                </button>
              ))}
            </div>

            {/* Cards */}
            {filteredApps.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                {orderApps.length === 0
                  ? 'No applications yet for this order.'
                  : `No ${appFilter !== 'all' ? appFilter : ''} applications.`}
              </div>
            ) : (
              <div className="space-y-3 pb-2">
                {filteredApps.map((app) => (
                  <ApplicationCard key={app.id} app={app} onOpenModal={openModal} onAction={handleAction} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Confirm Modal */}
      <ConfirmModal modal={modal} onClose={closeModal} onConfirm={handleModalConfirm} />
    </div>
  );
}
