'use client';

import { useEffect, useState } from 'react';

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

const TrendingIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
  </svg>
);

const FileIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path>
  </svg>
);

export default function FreelancerDashboard() {
  const [profileName, setProfileName] = useState('');
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    fetch('/api/profile', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.profile) {
          const p = json.profile;
          setProfileName(
            p.fullName ||
            `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() ||
            p.email ||
            ''
          );
          if (p.createdAt) {
            setMemberSince(
              new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back{profileName ? `, ${profileName}` : ''}!</p>
          </div>
          <div className="flex items-center gap-4">
            {/* <Link href="/freelancer/dashboard/edit">
              <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                Add Widget
              </button>
            </Link> */}
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Member Since</p>
              <p className="text-xl font-semibold text-gray-900">{memberSince || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Earnings',
            value: '€3,450',
            change: '+€250 this month',
            icon: TrendingIcon,
            color: 'from-green-400 to-green-600',
          },
          {
            label: 'Jobs Completed',
            value: '18',
            change: '+3 this month',
            icon: CheckCircleIcon,
            color: 'from-blue-400 to-blue-600',
          },
          {
            label: 'Avg Rating',
            value: '4.8/5',
            change: 'From 24 reviews',
            icon: FileIcon,
            color: 'from-yellow-400 to-yellow-600',
          },
          {
            label: 'Pending Payout',
            value: '€820',
            change: 'Processing',
            icon: ClockIcon,
            color: 'from-purple-400 to-purple-600',
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
                <div className={`bg-linear-to-br ${stat.color} p-3 rounded-lg text-white`}>
                  <Icon />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-sm text-green-600 font-semibold">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assigned Jobs - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Assigned Jobs</h2>
            <a href="/freelancer/jobs" className="text-green-700 hover:text-green-800 font-semibold text-sm">
              View All →
            </a>
          </div>

          <div className="space-y-4">
            {[
              {
                orderNum: 'ORD-2026-045',
                title: 'Product Evaluation - North Region',
                status: 'Confirmed',
                dueDate: 'Mar 10, 2026',
                statusColor: 'bg-green-100 text-green-700',
              },
              {
                orderNum: 'ORD-2026-042',
                title: 'Survey Participation - Tech Product',
                status: 'In Progress',
                dueDate: 'Mar 8, 2026',
                statusColor: 'bg-blue-100 text-blue-700',
              },
              {
                orderNum: 'ORD-2026-040',
                title: 'Presentation Review - Marketing Campaign',
                status: 'Awaiting Feedback',
                dueDate: 'Mar 12, 2026',
                statusColor: 'bg-yellow-100 text-yellow-700',
              },
            ].map((job, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 border border-gray-200 transition-all group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-gray-900">{job.orderNum}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.statusColor}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{job.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {job.dueDate}</p>
                </div>
                <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-semibold whitespace-nowrap ml-4">
                  View Job
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          {/* Invoice History Summary */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice Status</h3>
            <div className="space-y-3">
              {[
                { status: 'Paid', count: 12, color: 'text-green-600' },
                { status: 'Approved', count: 3, color: 'text-blue-600' },
                { status: 'Pending', count: 1, color: 'text-yellow-600' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{item.status}</span>
                  <span className={`text-2xl font-bold ${item.color}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payout History */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Payouts</h3>
            <div className="space-y-3">
              {[
                { date: 'Feb 28, 2026', amount: '€450', status: 'Completed' },
                { date: 'Feb 15, 2026', amount: '€320', status: 'Completed' },
                { date: 'Jan 31, 2026', amount: '€525', status: 'Completed' },
              ].map((payout, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{payout.date}</p>
                    <p className="text-xs text-gray-600">{payout.status}</p>
                  </div>
                  <span className="font-bold text-green-600">{payout.amount}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg px-4 py-2 border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold transition-colors text-sm">
              View All Payouts
            </button>
          </div>
        </div>
      </div>

      {/* Performance Section */}
      <div className="mt-8 bg-white rounded-lg border-2 border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Performance</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { metric: 'Completion Rate', value: '100%', trend: 'Perfect record' },
            { metric: 'Response Time', value: '2h avg', trend: 'Above average' },
            { metric: 'Client Satisfaction', value: '98%', trend: 'Excellent feedback' },
          ].map((perf, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:border-green-600 transition-all">
              <p className="text-gray-600 text-sm mb-2">{perf.metric}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{perf.value}</p>
              <p className="text-xs text-green-600 font-semibold">{perf.trend}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 flex gap-4">
        <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V10M6.5 6.5h7M6.5 10h7M6.5 13.5h4" clipRule="evenodd"></path>
          </svg>
          Browse Available Jobs
        </button>
        <button className="inline-flex items-center gap-2 border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V1z"></path>
            <path fillRule="evenodd" d="M3 6a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6z" clipRule="evenodd"></path>
          </svg>
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
