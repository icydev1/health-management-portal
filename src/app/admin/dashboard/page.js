'use client';

import { useState } from 'react';
import Link from 'next/link';

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" clipRule="evenodd"></path>
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V10M6.5 6.5h7M6.5 10h7M6.5 13.5h4"></path>
    <path d="M15 3v4m0 0l-1.5-1.5M15 7l1.5-1.5"></path>
  </svg>
);

const OrderIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" clipRule="evenodd"></path>
  </svg>
);

const RevenueIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M8.5 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8.5 13a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
  </svg>
);

const TrendingIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
  </svg>
);

export default function AdminDashboard() {
  const [timeFrame, setTimeFrame] = useState('month');

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Order and Freelancer Management System</p>
          </div>
          <div className="flex gap-2 items-center">
            {/* <Link href="/admin/dashboard/add">
              <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors mr-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                Add Widget
              </button>
            </Link> */}
            {['week', 'month', 'year'].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeFrame(frame)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeFrame === frame
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {frame.charAt(0).toUpperCase() + frame.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Revenue',
            value: '€45,320',
            change: '+23.5%',
            icon: RevenueIcon,
            color: 'from-green-400 to-green-600',
          },
          {
            label: 'Active Orders',
            value: '142',
            change: '+12%',
            icon: OrderIcon,
            color: 'from-blue-400 to-blue-600',
          },
          {
            label: 'Total Freelancers',
            value: '2,543',
            change: '+8%',
            icon: UsersIcon,
            color: 'from-purple-400 to-purple-600',
          },
          {
            label: 'Avg Feedback Score',
            value: '4.8/5',
            change: '+0.2',
            icon: StarIcon,
            color: 'from-yellow-400 to-yellow-600',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-green-600 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
                <div
                  className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white`}
                >
                  <Icon />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-sm text-green-600 font-semibold">{stat.change} this month</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Pipeline - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Pipeline Status</h2>

          <div className="space-y-4">
            {[
              { label: 'Open Orders', value: 45, percentage: 35, color: 'bg-blue-500' },
              { label: 'Assigned Orders', value: 62, percentage: 50, color: 'bg-green-700' },
              { label: 'Completed Orders', value: 28, percentage: 85, color: 'bg-green-600' },
              { label: 'Cancelled Orders', value: 7, percentage: 20, color: 'bg-red-500' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-700 font-semibold">{item.label}</p>
                  <span className="text-lg font-bold text-gray-900">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Cancellation Rate */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Cancellation Rate</h3>
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertIcon />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">4.2%</div>
            <p className="text-sm text-gray-600">Slightly above target (3%)</p>
            <button className="mt-4 w-full rounded-lg px-4 py-2 border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold transition-colors">
              Review Cancellations
            </button>
          </div>

          {/* Upcoming Orders */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Orders</h3>
            <div className="space-y-3">
              {[
                { order: 'ORD-2026-042', date: 'Mar 5', priority: 'High' },
                { order: 'ORD-2026-043', date: 'Mar 6', priority: 'Medium' },
                { order: 'ORD-2026-044', date: 'Mar 7', priority: 'Low' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.order}</p>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : item.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Order Distribution by Region */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Distribution</h2>
          <div className="space-y-4">
            {[
              { region: 'North Region', orders: 34, percentage: 42, color: 'from-blue-400 to-blue-600' },
              { region: 'South Region', orders: 28, percentage: 35, color: 'from-green-400 to-green-600' },
              { region: 'East Region', orders: 22, percentage: 27, color: 'from-purple-400 to-purple-600' },
              { region: 'West Region', orders: 18, percentage: 22, color: 'from-pink-400 to-pink-600' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-700">{item.region}</p>
                    <span className="text-gray-900 font-bold">{item.orders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${item.color} h-2 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activities</h2>
            <a href="#" className="text-green-700 hover:text-green-800 font-semibold text-sm">
              View All →
            </a>
          </div>

          <div className="space-y-4">
            {[
              {
                action: 'Order ORD-2026-040 assigned to Sarah Ahmed',
                time: '5 minutes ago',
                type: 'assignment',
              },
              {
                action: 'Invoice INV-2026-038 approved',
                time: '2 hours ago',
                type: 'payment',
              },
              {
                action: 'New freelancer registered: Mike Chen',
                time: '4 hours ago',
                type: 'user',
              },
              {
                action: 'Order ORD-2026-035 marked as completed',
                time: '1 day ago',
                type: 'completion',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 border border-gray-200 transition-all"
              >
                <div
                  className={`flex-shrink-0 p-2 rounded-lg ${
                    item.type === 'assignment'
                      ? 'bg-blue-100'
                      : item.type === 'payment'
                      ? 'bg-green-100'
                      : item.type === 'user'
                      ? 'bg-purple-100'
                      : 'bg-yellow-100'
                  }`}
                >
                  <CheckCircleIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-sm">{item.action}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
          </svg>
          Create New Order
        </button>
        <button className="inline-flex items-center gap-2 border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" clipRule="evenodd"></path>
          </svg>
          View Reports
        </button>
      </div>
    </div>
  );
}
