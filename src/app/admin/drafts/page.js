'use client';

import { useState } from 'react';
import Link from 'next/link';

const MOCK_DRAFTS = [
  {
    id: 1,
    ref: 'DRF-2026-003',
    company: 'Bosch GmbH',
    contactPerson: 'Anna Müller',
    city: 'Stuttgart',
    date: '2026-04-22',
    products: ['Workshop – 90 minutes', 'Cardioscan®'],
    creatorInitials: 'YL',
    creatorName: 'Yves Lubaki',
    region: 'BAYERN',
    createdAt: '2026-04-09',
    missingFields: ['Time', 'Fee'],
  },
  {
    id: 2,
    ref: 'DRF-2026-002',
    company: 'Siemens AG',
    contactPerson: 'Klaus Weber',
    city: 'Munich',
    date: '2026-04-30',
    products: ['Presentation – 60 minutes'],
    creatorInitials: 'MS',
    creatorName: 'Maria Schmidt',
    region: 'BAYERN',
    createdAt: '2026-04-08',
    missingFields: ['Contact email', 'Documents'],
  },
  {
    id: 3,
    ref: 'DRF-2026-001',
    company: 'Deutsche Telekom',
    contactPerson: 'Petra Klein',
    city: 'Berlin',
    date: null,
    products: ['FMS (Functional Movement Screening)', 'BodyScan'],
    creatorInitials: 'YL',
    creatorName: 'Yves Lubaki',
    region: 'BERLIN_BRANDENBURG',
    createdAt: '2026-04-07',
    missingFields: ['Date', 'Time', 'Fee', 'Freelancer'],
  },
];

const REGION_LABELS = {
  NORD_WEST: 'North West',
  BAYERN: 'Bayern',
  BERLIN_BRANDENBURG: 'Berlin / Brandenburg',
  SACHSEN: 'Sachsen',
};

const CREATOR_COLORS = {
  YL: 'bg-green-600',
  MS: 'bg-blue-600',
  AK: 'bg-purple-600',
  RB: 'bg-orange-600',
};

export default function DraftsPage() {
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState('ALL');

  const filtered = MOCK_DRAFTS.filter((d) => {
    const matchSearch =
      d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.ref.toLowerCase().includes(search.toLowerCase()) ||
      d.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());
    const matchRegion = filterRegion === 'ALL' || d.region === filterRegion;
    return matchSearch && matchRegion;
  });

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Drafts</h1>
          <p className="text-gray-600">
            Incomplete orders saved for later — visible to all admins in the same region
          </p>
        </div>
        <Link href="/admin/orders/new">
          <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Draft
          </button>
        </Link>
      </div>

      {/* Info banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-blue-700">
          Drafts are shared with all admins in the same region. Each draft shows the creator's initials so everyone knows who started it.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mb-6 flex gap-3 flex-col md:flex-row">
        <div className="flex-1 relative">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search by company, reference, contact or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
          />
        </div>
        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
        >
          <option value="ALL">All Regions</option>
          <option value="NORD_WEST">North West</option>
          <option value="BAYERN">Bayern</option>
          <option value="BERLIN_BRANDENBURG">Berlin / Brandenburg</option>
          <option value="SACHSEN">Sachsen</option>
        </select>
      </div>

      {/* Draft Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No drafts found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((draft) => (
            <div key={draft.id} className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl p-5 transition-all hover:shadow-md flex flex-col gap-4">
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-mono mb-1">{draft.ref}</p>
                  <h3 className="text-base font-bold text-gray-900 truncate">{draft.company}</h3>
                  <p className="text-sm text-gray-500">{draft.contactPerson}</p>
                </div>
                {/* Creator badge */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full ${CREATOR_COLORS[draft.creatorInitials] ?? 'bg-gray-500'} flex items-center justify-center text-white font-bold text-sm`}>
                    {draft.creatorInitials}
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{draft.creatorName.split(' ')[0]}</span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {draft.city} · {REGION_LABELS[draft.region] ?? draft.region}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {draft.date ?? <span className="text-orange-500 font-medium">Date missing</span>}
                </span>
              </div>

              {/* Products */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Products</p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.products.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">{p}</span>
                  ))}
                </div>
              </div>

              {/* Missing fields warning */}
              {draft.missingFields.length > 0 && (
                <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-xs font-semibold text-orange-700 mb-1">Missing information:</p>
                  <div className="flex flex-wrap gap-1">
                    {draft.missingFields.map((f, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-auto">
                <span className="text-xs text-gray-400">Created {draft.createdAt}</span>
                <div className="flex gap-2">
                  <Link href={`/admin/orders/new?draft=${draft.id}`}>
                    <button className="text-xs font-semibold text-green-700 hover:text-green-900 px-3 py-1.5 border border-green-300 hover:bg-green-50 rounded-lg transition-colors">
                      Continue
                    </button>
                  </Link>
                  <button className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-200 hover:bg-red-50 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-xs text-gray-400 text-right">{filtered.length} draft{filtered.length !== 1 ? 's' : ''} shown</div>
    </div>
  );
}
