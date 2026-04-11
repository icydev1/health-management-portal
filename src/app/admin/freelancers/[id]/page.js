'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FREELANCER = {
  firstName: 'Sarah',
  lastName: 'Ahmed',
  email: 'sarah.ahmed@example.com',
  phone: '+49 89 1234 5678',
  region: 'Bayern',
  city: 'Munich',
  status: 'ACTIVE',
  role: 'FREELANCER',
  joinedAt: '15/06/2024',
  bio: 'Certified nutritionist with 7+ years of experience in corporate wellness programs. Specializes in nutrition presentations and health workshops.',
  certifications: ['Certified Nutritionist (VDOE)', 'Workplace Health Coach', 'First Aid'],
  languages: ['German', 'English'],
  totalEarnings: '€4,820',
  completedJobs: 24,
  rating: 4.8,
};

const JOBS = [
  { id: 1, orderNum: 'ORD-2026-045', title: 'Product Evaluation - North Region',   company: 'PharmaGroup GmbH', city: 'Munich',    date: '2026-03-05', amount: '€150', status: 'in_progress' },
  { id: 2, orderNum: 'ORD-2026-038', title: 'Nutrition Workshop – Spring Edition',  company: 'Siemens AG',       city: 'Berlin',    date: '2026-02-10', amount: '€300', status: 'completed'   },
  { id: 3, orderNum: 'ORD-2026-031', title: 'Retail Store Audit',                   company: 'RetailPlus GmbH',  city: 'Hamburg',   date: '2026-01-28', amount: '€160', status: 'completed'   },
  { id: 4, orderNum: 'ORD-2025-091', title: 'Employee Wellness Presentation',       company: 'Bosch GmbH',       city: 'Stuttgart', date: '2025-11-15', amount: '€280', status: 'completed'   },
  { id: 5, orderNum: 'ORD-2025-078', title: 'Cardio Screening Day',                 company: 'Deutsche Telekom', city: 'Munich',    date: '2025-10-02', amount: '€400', status: 'completed'   },
];

const FEEDBACKS = [
  { id: 1, orderNum: 'ORD-2026-038', company: 'Siemens AG',       rating: 5, comment: 'Sarah was incredibly professional and the participants loved her presentation style. Will definitely book again.', date: '2026-02-12', adminName: 'Yves Lubaki' },
  { id: 2, orderNum: 'ORD-2026-031', company: 'RetailPlus GmbH',  rating: 5, comment: 'Arrived on time, thorough audit, very good feedback from store managers.', date: '2026-01-30', adminName: 'Maria Schmidt' },
  { id: 3, orderNum: 'ORD-2025-091', company: 'Bosch GmbH',       rating: 4, comment: 'Great content and delivery. Minor issue with timing in the second half.', date: '2025-11-18', adminName: 'Yves Lubaki' },
  { id: 4, orderNum: 'ORD-2025-078', company: 'Deutsche Telekom', rating: 5, comment: 'Exceptional work. The screening day went perfectly, very organized.', date: '2025-10-04', adminName: 'Yves Lubaki' },
];

const JOB_STATUS_STYLES = {
  in_progress: 'bg-green-100 text-green-700',
  completed:   'bg-gray-100 text-gray-600',
  upcoming:    'bg-blue-100 text-blue-700',
};
const JOB_STATUS_LABELS = {
  in_progress: 'In Progress',
  completed:   'Completed',
  upcoming:    'Upcoming',
};

const TABS = [
  { key: 'overview',  label: 'Overview' },
  { key: 'jobs',      label: 'Jobs & History' },
  { key: 'feedbacks', label: 'Feedbacks' },
];

function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function FreelancerProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobFilter, setJobFilter] = useState('all');

  const fullName = `${FREELANCER.firstName} ${FREELANCER.lastName}`;
  const initials = `${FREELANCER.firstName[0]}${FREELANCER.lastName[0]}`;

  const avgRating = (FEEDBACKS.reduce((s, f) => s + f.rating, 0) / FEEDBACKS.length).toFixed(1);

  const filteredJobs = jobFilter === 'all' ? JOBS : JOBS.filter((j) => j.status === jobFilter);

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
        Back to Freelancers
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-green-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                <p className="text-gray-500 text-sm mt-0.5">{FREELANCER.email} · {FREELANCER.phone}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {FREELANCER.city} · {FREELANCER.region}
                  </span>
                  <span>·</span>
                  <span>Joined {FREELANCER.joinedAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Active</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Freelancer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{JOBS.length}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{JOBS.filter((j) => j.status === 'completed').length}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-900">{FREELANCER.totalEarnings}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Avg. Rating</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
              <StarRating rating={parseFloat(avgRating)} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b-2 border-gray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-green-700 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-3">About</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{FREELANCER.bio}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {FREELANCER.certifications.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">{c}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {FREELANCER.languages.map((l, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">{l}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border-2 border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Feedbacks</h3>
              <button onClick={() => setActiveTab('feedbacks')} className="text-xs font-semibold text-green-700 hover:underline">
                View all →
              </button>
            </div>
            <div className="space-y-3">
              {FEEDBACKS.slice(0, 2).map((fb) => (
                <div key={fb.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <StarRating rating={fb.rating} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 italic">"{fb.comment}"</p>
                    <p className="text-xs text-gray-400 mt-1">{fb.company} · {fb.date} · by {fb.adminName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Jobs & History Tab ── */}
      {activeTab === 'jobs' && (
        <div>
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {[
              { key: 'all',         label: 'All',         count: JOBS.length },
              { key: 'in_progress', label: 'In Progress', count: JOBS.filter((j) => j.status === 'in_progress').length },
              { key: 'completed',   label: 'Completed',   count: JOBS.filter((j) => j.status === 'completed').length },
            ].map((f) => (
              <button key={f.key} onClick={() => setJobFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border-2 ${
                  jobFilter === f.key
                    ? 'border-green-600 bg-green-50 text-green-700 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                }`}>
                {f.label} · {f.count}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl p-5 transition-all hover:shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-gray-400 mb-1">{job.orderNum}</p>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug">{job.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{job.company} · {job.city}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${JOB_STATUS_STYLES[job.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {JOB_STATUS_LABELS[job.status] ?? job.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {job.date}
                  </span>
                  <span className="text-sm font-bold text-green-700">{job.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Feedbacks Tab ── */}
      {activeTab === 'feedbacks' && (
        <div>
          {/* Summary */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-5 mb-5 flex items-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">{avgRating}</p>
              <StarRating rating={parseFloat(avgRating)} />
              <p className="text-xs text-gray-400 mt-1">{FEEDBACKS.length} reviews</p>
            </div>
            <div className="flex-1 min-w-[160px] space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = FEEDBACKS.filter((f) => f.rating === star).length;
                const pct = Math.round((count / FEEDBACKS.length) * 100);
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3">{star}</span>
                    <svg className="w-3.5 h-3.5 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {FEEDBACKS.map((fb) => (
              <div key={fb.id} className="bg-white rounded-xl border-2 border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{fb.company}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{fb.orderNum} · {fb.date}</p>
                  </div>
                  <StarRating rating={fb.rating} />
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed">"{fb.comment}"</p>
                <p className="text-xs text-gray-400 mt-3">Reviewed by <span className="font-semibold text-gray-500">{fb.adminName}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
