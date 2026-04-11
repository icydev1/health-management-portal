'use client';

import { useState } from 'react';
import Link from 'next/link';

const REGIONS = [
  { key: 'all',                label: 'All Regions' },
  { key: 'NORD_WEST',          label: 'North West' },
  { key: 'BAYERN',             label: 'Bayern' },
  { key: 'BERLIN_BRANDENBURG', label: 'Berlin / Brandenburg' },
  { key: 'SACHSEN',            label: 'Sachsen' },
];

const MOCK_JOBS = [
  {
    id: 1,
    orderNum: 'ORD-2026-050',
    title: 'Workplace Health Workshop',
    region: 'NORD_WEST',
    city: 'Hamburg',
    date: '2026-04-22',
    time: '09:00',
    fee: '€350',
    travelAllowance: '€40',
    products: ['Workshop – 90 minutes'],
    status: 'available',
    description: 'Workshop on stress management for a corporate client in Hamburg.',
  },
  {
    id: 2,
    orderNum: 'ORD-2026-049',
    title: 'Cardio & Vital Screening Day',
    region: 'NORD_WEST',
    city: 'Bremen',
    date: '2026-04-28',
    time: '08:00',
    fee: '€500',
    travelAllowance: '€60',
    products: ['CardioCheck', 'Vital Screening (Vitalscreening)'],
    status: 'applied',
    description: 'Full-day health screening event for 80+ employees.',
  },
  {
    id: 3,
    orderNum: 'ORD-2026-048',
    title: 'Nutrition Presentation',
    region: 'BAYERN',
    city: 'Munich',
    date: '2026-05-06',
    time: '14:00',
    fee: '€350',
    travelAllowance: '€30',
    products: ['Presentation – 60 minutes'],
    status: 'assigned',
    description: 'Presentation on healthy eating habits for a pharmaceutical company.',
  },
  {
    id: 4,
    orderNum: 'ORD-2026-047',
    title: 'Active Stand Day',
    region: 'BERLIN_BRANDENBURG',
    city: 'Berlin',
    date: '2026-05-14',
    time: '10:00',
    fee: '€420',
    travelAllowance: '€0',
    products: ['SmoothieBike', 'Blaze Pods'],
    status: 'available',
    description: 'Fun stand actions at a large tech company health fair.',
  },
  {
    id: 5,
    orderNum: 'ORD-2026-046',
    title: 'Back Health Screening',
    region: 'SACHSEN',
    city: 'Leipzig',
    date: '2026-04-18',
    time: '09:30',
    fee: '€280',
    travelAllowance: '€55',
    products: ['Medi Mouse®', 'FMS – Functional Movement Screening'],
    status: 'available',
    description: 'Posture and back health screening for manufacturing staff.',
  },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm]     = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [applyJob, setApplyJob]         = useState(null);
  const [applyNote, setApplyNote]       = useState('');
  const [applied, setApplied]           = useState(false);
  const [jobs, setJobs]                 = useState(MOCK_JOBS);

  const filtered = jobs.filter((job) => {
    const matchSearch  = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.orderNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus  = filterStatus === 'all' || job.status === filterStatus;
    const matchRegion  = filterRegion === 'all' || job.region === filterRegion;
    return matchSearch && matchStatus && matchRegion;
  });

  const handleApplyConfirm = () => {
    setJobs((prev) => prev.map((j) => j.id === applyJob.id ? { ...j, status: 'applied' } : j));
    setApplied(true);
    setTimeout(() => { setApplyJob(null); setApplyNote(''); setApplied(false); }, 1800);
  };

  const STATUS_BADGE = {
    available: 'bg-green-100 text-green-700',
    applied:   'bg-blue-100 text-blue-700',
    assigned:  'bg-purple-100 text-purple-700',
  };
  const STATUS_LABEL = { available: 'Available', applied: 'Applied', assigned: 'Assigned' };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Jobs</h1>
        <p className="text-gray-600">Browse and apply for assignments in your region</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-3 flex-col md:flex-row">
        <div className="flex-1 relative">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search by title, order number or city…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
          />
        </div>
        <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white">
          {REGIONS.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white">
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="applied">Applied</option>
          <option value="assigned">Assigned</option>
        </select>
      </div>

      {/* Job Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No jobs found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((job) => (
            <div key={job.id} className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl p-5 transition-all hover:shadow-md flex flex-col gap-3">
              {/* Top */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-mono">{job.orderNum}</p>
                  <h3 className="text-base font-bold text-gray-900 mt-0.5">{job.title}</h3>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[job.status]}`}>
                  {STATUS_LABEL[job.status]}
                </span>
              </div>

              <p className="text-sm text-gray-500">{job.description}</p>

              {/* Products */}
              <div className="flex flex-wrap gap-1.5">
                {job.products.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{p}</span>
                ))}
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {job.city} · {REGIONS.find((r) => r.key === job.region)?.label}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {job.date} · {job.time}
                </span>
                <span className="flex items-center gap-1 font-semibold text-gray-700">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Fee: {job.fee}
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  + Travel: {job.travelAllowance}
                </span>
              </div>

              {/* CTA */}
              <div className="mt-1">
                {job.status === 'available' && (
                  <button
                    onClick={() => { setApplyJob(job); setApplyNote(''); setApplied(false); }}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    Apply Now
                  </button>
                )}
                {job.status === 'applied' && (
                  <button className="w-full bg-blue-50 border-2 border-blue-200 text-blue-700 font-semibold py-2.5 rounded-lg text-sm cursor-default">
                    Application Submitted — Awaiting Decision
                  </button>
                )}
                {job.status === 'assigned' && (
                  <Link href={`/freelancer/my-jobs/${job.id}`}>
                    <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                      View My Assignment
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {applyJob && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {applied ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Application Submitted!</h3>
                <p className="text-sm text-gray-500">You will be notified once a decision has been made.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Apply for Assignment</h3>
                    <p className="text-sm text-gray-500">{applyJob.orderNum} · {applyJob.title}</p>
                  </div>
                  <button onClick={() => setApplyJob(null)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Job summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Time</span>
                    <span className="font-semibold text-gray-800">{applyJob.date} · {applyJob.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-semibold text-gray-800">{applyJob.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fee</span>
                    <span className="font-semibold text-green-700">{applyJob.fee} + {applyJob.travelAllowance} travel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Products</span>
                    <span className="font-semibold text-gray-800 text-right max-w-[60%]">{applyJob.products.join(', ')}</span>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Message / Note <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={applyNote}
                    onChange={(e) => setApplyNote(e.target.value)}
                    rows={3}
                    placeholder="Any notes for the admin, e.g. availability, questions…"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-sm resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setApplyJob(null)}
                    className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyConfirm}
                    className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors font-semibold text-sm"
                  >
                    Confirm Application
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
