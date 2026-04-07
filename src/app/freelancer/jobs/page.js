'use client';

import { useState } from 'react';

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
  </svg>
);

const EuroIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M8.5 5a.5.5 0 11-1 0 .5.5 0 011 0zM9 5.5a.5.5 0 100-1 .5.5 0 000 1z"></path>
  </svg>
);

const REGIONS = [
  { key: 'all',                label: 'All Regions' },
  { key: 'NORD_WEST',          label: 'North West' },
  { key: 'BAYERN',             label: 'Bayern' },
  { key: 'BERLIN_BRANDENBURG', label: 'Berlin / Brandenburg' },
  { key: 'SACHSEN',            label: 'Sachsen' },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm]   = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');

  const jobs = [
    {
      id: 1,
      orderNum: 'ORD-2026-050',
      title: 'Fresh Market Product Evaluation',
      region: 'NORD_WEST',
      amount: '€150',
      deadline: '2026-03-10',
      status: 'available',
      description: 'Evaluate new product line in local market',
    },
    {
      id: 2,
      orderNum: 'ORD-2026-049',
      title: 'Customer Feedback Survey',
      region: 'NORD_WEST',
      amount: '€120',
      deadline: '2026-03-08',
      status: 'applied',
      description: 'Collect customer feedback on recent campaign',
    },
    {
      id: 3,
      orderNum: 'ORD-2026-048',
      title: 'Marketing Campaign Review',
      region: 'BAYERN',
      amount: '€200',
      deadline: '2026-03-12',
      status: 'assigned',
      description: 'Review effectiveness of marketing materials',
    },
    {
      id: 4,
      orderNum: 'ORD-2026-047',
      title: 'Tech Product Testing',
      region: 'BERLIN_BRANDENBURG',
      amount: '€180',
      deadline: '2026-03-15',
      status: 'unavailable',
      description: 'Product not available in your region',
    },
    {
      id: 5,
      orderNum: 'ORD-2026-046',
      title: 'Retail Store Audit',
      region: 'SACHSEN',
      amount: '€160',
      deadline: '2026-03-11',
      status: 'available',
      description: 'Complete store audit and environment assessment',
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch  = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.orderNum.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus  = filterStatus === 'all' || job.status === filterStatus;
    const matchesRegion  = filterRegion === 'all' || job.region === filterRegion;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'applied':
        return 'bg-blue-100 text-blue-700';
      case 'assigned':
        return 'bg-green-600 text-white';
      case 'unavailable':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'applied':
        return 'Applied';
      case 'assigned':
        return 'Assigned';
      case 'unavailable':
        return 'Unavailable';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Jobs</h1>
          <p className="text-gray-600">Browse and apply for jobs in your region</p>
        </div>
        {/* <Link href="/freelancer/jobs/add">
          <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            Post Job
          </button>
        </Link> */}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4 flex-col md:flex-row">
        <div className="flex-1 relative">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search jobs by title or order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
          />
        </div>
        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
        >
          {REGIONS.map((r) => (
            <option key={r.key} value={r.key}>{r.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="applied">Applied</option>
          <option value="assigned">Assigned</option>
        </select>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-green-600 hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">{job.orderNum}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{job.title}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(job.status)}`}>
                {getStatusLabel(job.status)}
              </span>
            </div>

            {/* Details */}
            <p className="text-gray-600 text-sm mb-4">{job.description}</p>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <MapIcon />
                <span>{REGIONS.find((r) => r.key === job.region)?.label ?? job.region}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <EuroIcon />
                <span className="font-semibold">{job.amount}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v2h16V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a2 2 0 002 2h8a2 2 0 002-2H6z" clipRule="evenodd"></path>
                </svg>
                <span>Deadline: {job.deadline}</span>
              </div>
            </div>

            {/* Action Button */}
            {job.status === 'available' && (
              <button className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors">
                Apply Now
              </button>
            )}
            {job.status === 'applied' && (
              <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors">
                View Application
              </button>
            )}
            {job.status === 'assigned' && (
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
                View Assignment
              </button>
            )}
            {job.status === 'unavailable' && (
              <button className="w-full bg-gray-400 text-white font-semibold py-3 rounded-lg cursor-not-allowed" disabled>
                Not Available in Your Region
              </button>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No jobs found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
