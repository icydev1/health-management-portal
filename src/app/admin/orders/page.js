'use client';

import { useState } from 'react';
import Link from 'next/link';

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 016 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const orders = [
    {
      id: 1,
      orderNum: 'ORD-2026-045',
      title: 'Product Evaluation - North Region',
      freelancer: 'Sarah Ahmed',
      status: 'Assigned',
      amount: '€150',
      date: '2026-03-05',
      progress: 60,
    },
    {
      id: 2,
      orderNum: 'ORD-2026-044',
      title: 'Survey Participation - Tech',
      freelancer: 'Mike Chen',
      status: 'Open',
      amount: '€200',
      date: '2026-03-04',
      progress: 0,
    },
    {
      id: 3,
      orderNum: 'ORD-2026-043',
      title: 'Presentation Review',
      freelancer: 'Jessica Park',
      status: 'Completed',
      amount: '€180',
      date: '2026-02-28',
      progress: 100,
    },
    {
      id: 4,
      orderNum: 'ORD-2026-042',
      title: 'Marketing Campaign Evaluation',
      freelancer: 'Alex Brown',
      status: 'Assigned',
      amount: '€220',
      date: '2026-03-02',
      progress: 75,
    },
    {
      id: 5,
      orderNum: 'ORD-2026-041',
      title: 'Customer Feedback Collection',
      freelancer: '',
      status: 'Cancelled',
      amount: '€100',
      date: '2026-02-27',
      progress: 0,
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-700';
      case 'Assigned':
        return 'bg-green-100 text-green-700';
      case 'Completed':
        return 'bg-green-600 text-white';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-600">Manage and track all orders</p>
          </div>
          <Link href="/admin/orders/add">
            <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              <PlusIcon />
              Create Order
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
            placeholder="Search by order number or title..."
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
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Order Number</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Title</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Freelancer</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Progress</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{order.orderNum}</td>
                  <td className="px-6 py-4 text-gray-700">{order.title}</td>
                  <td className="px-6 py-4 text-gray-600">{order.freelancer || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link href="/admin/orders/edit">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <EyeIcon />
                      </button>
                    </Link>
                    <Link href="/admin/orders/edit">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <EditIcon />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      )}
    </div>
  );
}
