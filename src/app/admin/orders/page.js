'use client';

import { useState } from 'react';
import Link from 'next/link';

const REGION_LABELS = {
  NORD_WEST: 'North West',
  BAYERN: 'Bayern',
  BERLIN_BRANDENBURG: 'Berlin / Brandenburg',
  SACHSEN: 'Sachsen',
};

const ORDERS = [
  {
    id: 0,
    orderNum: 'DRF-2026-003',
    title: 'Bosch GmbH – Workshop + Cardioscan',
    company: 'Bosch GmbH',
    contactPerson: 'Hans Berger',
    city: 'Bremen',
    region: 'NORD_WEST',
    date: '2026-04-22',
    time: '09:00',
    products: ['Workshop – 90 minutes', 'CardioCheck'],
    freelancer: '',
    freelancerInitials: '',
    status: 'Draft',
    amount: '€650',
    progress: 0,
    createdAt: '2026-04-09',
  },
  {
    id: 1,
    orderNum: 'ORD-2026-045',
    title: 'Product Evaluation - North Region',
    company: 'PharmaGroup GmbH',
    contactPerson: 'Anna Müller',
    city: 'Munich',
    region: 'BAYERN',
    date: '2026-03-05',
    time: '14:00',
    products: ['Presentation – 60 minutes'],
    freelancer: 'Sarah Ahmed',
    freelancerInitials: 'SA',
    status: 'Assigned',
    amount: '€150',
    progress: 60,
    createdAt: '2026-02-20',
  },
  {
    id: 2,
    orderNum: 'ORD-2026-044',
    title: 'Survey Participation - Tech',
    company: 'TechCorp AG',
    contactPerson: 'Stefan Koch',
    city: 'Hamburg',
    region: 'NORD_WEST',
    date: '2026-03-04',
    time: '10:00',
    products: ['Survey – 45 minutes'],
    freelancer: '',
    freelancerInitials: '',
    status: 'Open',
    amount: '€200',
    progress: 0,
    createdAt: '2026-02-18',
  },
  {
    id: 3,
    orderNum: 'ORD-2026-043',
    title: 'Presentation Review',
    company: 'Siemens AG',
    contactPerson: 'Eva Richter',
    city: 'Berlin',
    region: 'BERLIN_BRANDENBURG',
    date: '2026-02-28',
    time: '11:00',
    products: ['Presentation – 60 minutes'],
    freelancer: 'Jessica Park',
    freelancerInitials: 'JP',
    status: 'Completed',
    amount: '€180',
    progress: 100,
    createdAt: '2026-02-01',
  },
  {
    id: 4,
    orderNum: 'ORD-2026-042',
    title: 'Marketing Campaign Evaluation',
    company: 'MediaGroup GmbH',
    contactPerson: 'Laura Becker',
    city: 'Cologne',
    region: 'NORD_WEST',
    date: '2026-03-02',
    time: '13:00',
    products: ['Workshop – 60 minutes'],
    freelancer: 'Alex Brown',
    freelancerInitials: 'AB',
    status: 'Assigned',
    amount: '€220',
    progress: 75,
    createdAt: '2026-02-15',
  },
  {
    id: 5,
    orderNum: 'ORD-2026-041',
    title: 'Customer Feedback Collection',
    company: 'RetailPlus GmbH',
    contactPerson: '',
    city: 'Frankfurt',
    region: 'NORD_WEST',
    date: '2026-02-27',
    time: '09:00',
    products: ['Feedback Survey'],
    freelancer: '',
    freelancerInitials: '',
    status: 'Cancelled',
    amount: '€100',
    progress: 0,
    createdAt: '2026-02-10',
  },
];

const STATUS_STYLES = {
  Draft:     'bg-yellow-100 text-yellow-700 border-yellow-200',
  Open:      'bg-blue-100 text-blue-700 border-blue-200',
  Assigned:  'bg-green-100 text-green-700 border-green-200',
  Completed: 'bg-green-600 text-white border-green-600',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const PROGRESS_COLORS = {
  Draft:     'bg-yellow-400',
  Open:      'bg-blue-500',
  Assigned:  'bg-green-500',
  Completed: 'bg-green-600',
  Cancelled: 'bg-red-400',
};

const INITIALS_COLORS = ['bg-green-600','bg-blue-600','bg-purple-600','bg-orange-500','bg-rose-600','bg-teal-600','bg-indigo-600','bg-pink-600'];
function avatarColor(initials) {
  let h = 0; for (const c of initials) h = c.charCodeAt(0) + h;
  return INITIALS_COLORS[h % INITIALS_COLORS.length];
}

export default function OrdersPage() {
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = ORDERS.filter((o) => {
    const matchSearch =
      o.orderNum.toLowerCase().includes(search.toLowerCase()) ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.company.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">Manage and track all orders</p>
        </div>
        <Link href="/admin/orders/new">
          <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Order
          </button>
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="mb-6 flex gap-3 flex-col md:flex-row">
        <div className="flex-1 relative">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search by order, title, company or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
        >
          <option value="all">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl p-5 transition-all hover:shadow-md flex flex-col gap-4">

              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-mono mb-1">{order.orderNum}</p>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{order.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{order.company}</p>
                </div>
                {/* Status badge */}
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {order.status}
                </span>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {order.city} · {REGION_LABELS[order.region] ?? order.region}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {order.date} · {order.time}
                </span>
              </div>

              {/* Products */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Products</p>
                <div className="flex flex-wrap gap-1.5">
                  {order.products.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">{p}</span>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Progress</span>
                  <span className="text-xs font-bold text-gray-600">{order.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${PROGRESS_COLORS[order.status] ?? 'bg-gray-400'}`}
                    style={{ width: `${order.progress}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-2">
                  {order.freelancer ? (
                    <>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${avatarColor(order.freelancerInitials)}`}>
                        {order.freelancerInitials}
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{order.freelancer}</span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400 italic">No freelancer assigned</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-green-700">{order.amount}</span>
                  <Link href={`/admin/orders/${encodeURIComponent(order.orderNum)}`}>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors" title="View Order">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      View
                    </button>
                  </Link>
                  <Link href={`/admin/orders/edit?id=${order.orderNum}`}>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 border border-green-300 hover:bg-green-50 rounded-lg transition-colors" title="Edit Order">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-xs text-gray-400 text-right">{filtered.length} order{filtered.length !== 1 ? 's' : ''} shown</div>
    </div>
  );
}
