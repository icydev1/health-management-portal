'use client';

import { useState } from 'react';
import Link from 'next/link';

const REGION_LABELS = {
  NORD_WEST:          'North West',
  BAYERN:             'Bayern',
  BERLIN_BRANDENBURG: 'Berlin / Brandenburg',
  SACHSEN:            'Sachsen',
};

const TABS = [
  { key: 'all',         label: 'All' },
  { key: 'upcoming',    label: 'Upcoming' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'due_soon',    label: 'Due Soon' },
  { key: 'completed',   label: 'Completed' },
  { key: 'expired',     label: 'Expired' },
];

const STATUS_STYLES = {
  upcoming:    { badge: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
  in_progress: { badge: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  due_soon:    { badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  completed:   { badge: 'bg-gray-100 text-gray-700',     dot: 'bg-gray-400' },
  expired:     { badge: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
};

const STATUS_LABELS = {
  upcoming:    'Upcoming',
  in_progress: 'In Progress',
  due_soon:    'Due Soon',
  completed:   'Completed',
  expired:     'Expired',
};

const MOCK_HISTORY = [
  {
    id: 1,
    orderNum: 'ORD-2026-045',
    title: 'Product Evaluation — North West',
    region: 'NORD_WEST',
    amount: '€150',
    assignedDate: '2026-02-15',
    deadline: '2026-04-20',
    status: 'upcoming',
    description: 'Evaluate new product line at local market stores.',
  },
  {
    id: 2,
    orderNum: 'ORD-2026-042',
    title: 'Survey Participation — Tech Product',
    region: 'NORD_WEST',
    amount: '€120',
    assignedDate: '2026-03-01',
    deadline: '2026-04-04',
    status: 'in_progress',
    description: 'Collect and submit customer feedback on the tech product campaign.',
  },
  {
    id: 3,
    orderNum: 'ORD-2026-040',
    title: 'Presentation Review — Marketing Campaign',
    region: 'BAYERN',
    amount: '€200',
    assignedDate: '2026-03-05',
    deadline: '2026-04-03',
    status: 'due_soon',
    description: 'Review effectiveness of the Spring marketing materials.',
  },
  {
    id: 4,
    orderNum: 'ORD-2026-031',
    title: 'Retail Store Audit',
    region: 'NORD_WEST',
    amount: '€160',
    assignedDate: '2026-01-10',
    deadline: '2026-02-28',
    status: 'completed',
    description: 'Full store audit and environment assessment across 3 locations.',
  },
  {
    id: 5,
    orderNum: 'ORD-2026-028',
    title: 'Brand Awareness Survey',
    region: 'BERLIN_BRANDENBURG',
    amount: '€90',
    assignedDate: '2026-01-05',
    deadline: '2026-02-10',
    status: 'completed',
    description: 'Survey on brand recognition among target demographic.',
  },
  {
    id: 6,
    orderNum: 'ORD-2025-098',
    title: 'Year-End Product Review',
    region: 'NORD_WEST',
    amount: '€175',
    assignedDate: '2025-11-20',
    deadline: '2025-12-31',
    status: 'expired',
    description: 'Annual product quality review — submission deadline missed.',
  },
  {
    id: 7,
    orderNum: 'ORD-2025-085',
    title: 'Customer Experience Audit',
    region: 'SACHSEN',
    amount: '€140',
    assignedDate: '2025-10-01',
    deadline: '2025-11-01',
    status: 'expired',
    description: 'Audit of in-store customer experience flow.',
  },
];

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch]       = useState('');

  const filtered = MOCK_HISTORY.filter((job) => {
    const matchesTab    = activeTab === 'all' || job.status === activeTab;
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.orderNum.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const count = (key) =>
    key === 'all' ? MOCK_HISTORY.length : MOCK_HISTORY.filter((j) => j.status === key).length;

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Jobs</h1>
        <p className="text-gray-600">Track all your assigned jobs and their progress</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {TABS.filter((t) => t.key !== 'all').map((tab) => {
          const styles = STATUS_STYLES[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                activeTab === tab.key
                  ? 'border-green-600 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {tab.label}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{count(tab.key)}</p>
            </button>
          );
        })}
      </div>

      {/* Tabs + Search */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex gap-1 flex-wrap border-b border-gray-200 flex-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch(''); }}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-green-700 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {count(tab.key)}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search jobs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Job cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No jobs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((job) => {
            const styles = STATUS_STYLES[job.status];
            return (
              <div
                key={job.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-green-600 hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs text-gray-500 font-mono">{job.orderNum}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles.badge}`}>
                        {STATUS_LABELS[job.status]}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
                  </div>
                  <span className="text-xl font-bold text-green-700 shrink-0 ml-3">{job.amount}</span>
                </div>

                <p className="text-gray-500 text-sm mb-4 flex-1">{job.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <MapIcon />
                    {REGION_LABELS[job.region] ?? job.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon />
                    Assigned: {job.assignedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon />
                    Deadline: {job.deadline}
                  </span>
                </div>

                <JobAction status={job.status} id={job.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function JobAction({ status, id }) {
  const MAP = {
    in_progress: { label: 'View Details & Submit', cls: 'bg-green-700 hover:bg-green-800 text-white' },
    due_soon:    { label: 'View Details — Due Soon', cls: 'bg-orange-600 hover:bg-orange-700 text-white' },
    upcoming:    { label: 'View Details', cls: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50' },
    completed:   { label: 'View Report',  cls: 'border-2 border-gray-300 text-gray-600 hover:bg-gray-50' },
    expired:     { label: 'Expired',      cls: 'bg-red-50 text-red-600 border border-red-200 cursor-default' },
  };
  const item = MAP[status];
  if (!item) return null;
  if (status === 'expired') {
    return <button disabled className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${item.cls}`}>{item.label}</button>;
  }
  return (
    <Link href={`/freelancer/my-jobs/${id}`}>
      <button className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${item.cls}`}>
        {item.label}
      </button>
    </Link>
  );
}
