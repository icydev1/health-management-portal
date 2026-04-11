'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock assigned job detail
const MOCK_JOB = {
  id: 3,
  orderNum: 'ORD-2026-048',
  title: 'Nutrition Presentation',
  status: 'upcoming',
  date: '2026-05-06',
  time: '14:00',
  products: ['Presentation – 60 minutes'],
  productTitle: 'Healthy Eating in the Workplace',
  fee: 350,
  travelAllowance: 30,

  // Contact
  contactPerson: 'Anna Müller',
  contactEmail: 'a.mueller@pharmagroup.de',
  contactPhone: '+49 89 4321 100',

  // Company
  companyName: 'PharmaGroup GmbH',
  companyStreet: 'Leopoldstraße 44',
  companyZip: '80802',
  companyCity: 'Munich',
  companyCountry: 'Germany',
  companyContactPerson: 'Thomas Bauer (on-site)',

  // Logistics
  directions: 'Take U3/U6 to Münchner Freiheit. Exit towards Leopoldstraße. The building entrance is on the left side with a glass facade.',
  parkingOptions: 'Paid parking available at Tiefgarage Leopoldstraße (P5), approx. 5 min walk. Daily rate €12.',
  safetyInstructions: 'Visitor badge required. Check in at the main reception on the ground floor.',

  // Notes
  notes: 'Please arrive 30 minutes early to set up. AV equipment (projector, HDMI) will be provided. The room holds 40 participants.',

  daysUntil: 27,
};

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

export default function AssignedJobDetailPage() {
  const router = useRouter();
  const job = MOCK_JOB;

  const [hasRead, setHasRead] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [documents, setDocuments] = useState([]);

  const handleConfirm = () => {
    if (!hasRead) return;
    setConfirmed(true);
  };

  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files ?? []);
    setDocuments((p) => [...p, ...files.map((f) => ({ name: f.name, size: f.size }))]);
    e.target.value = '';
  };

  const urgencyColor = job.daysUntil <= 2
    ? 'bg-red-100 text-red-700 border-red-300'
    : job.daysUntil <= 14
    ? 'bg-orange-100 text-orange-700 border-orange-300'
    : 'bg-green-100 text-green-700 border-green-300';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5 font-semibold text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Jobs
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-400 font-mono mb-1">{job.orderNum}</p>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            {job.productTitle && <p className="text-gray-500 mt-1">"{job.productTitle}"</p>}
          </div>
          <div className={`px-4 py-2 rounded-xl border-2 text-sm font-bold ${urgencyColor}`}>
            {job.daysUntil <= 2 ? '⚠ ' : ''}{job.daysUntil} days until assignment
          </div>
        </div>
      </div>

      {/* Read confirmation banner */}
      {!confirmed && job.daysUntil <= 14 && (
        <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-orange-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-orange-700 font-medium">
            Please review all assignment details below and confirm you have read them. You will be reminded again 2 days before the assignment.
          </p>
        </div>
      )}

      <div className="space-y-5 max-w-3xl">

        {/* Assignment Overview */}
        <Section title="Assignment Overview" icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        }>
          <InfoRow label="Date" value={job.date} />
          <InfoRow label="Time" value={job.time} />
          <InfoRow label="Products" value={job.products.join(', ')} />
          {job.productTitle && <InfoRow label="Topic / Title" value={`"${job.productTitle}"`} />}
          <InfoRow label="Fee" value={`€${job.fee}`} />
          <InfoRow label="Travel Allowance (FKP)" value={`€${job.travelAllowance}`} />
        </Section>

        {/* Contact Person from CM */}
        <Section title="Your Contact at CM" icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        }>
          <InfoRow label="Name" value={job.contactPerson} />
          <InfoRow label="Email" value={job.contactEmail} />
          <InfoRow label="Phone" value={job.contactPhone} />
        </Section>

        {/* Company / Client */}
        <Section title="Company / Client" icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
          </svg>
        }>
          <InfoRow label="Company" value={job.companyName} />
          <InfoRow label="Address" value={`${job.companyStreet}, ${job.companyZip} ${job.companyCity}, ${job.companyCountry}`} />
          <InfoRow label="On-site Contact" value={job.companyContactPerson} />
        </Section>

        {/* Directions & Logistics */}
        <Section title="Directions & Logistics" icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        }>
          <InfoRow label="How to Get There" value={job.directions} />
          <InfoRow label="Parking" value={job.parkingOptions} />
          <InfoRow label="Safety Instructions" value={job.safetyInstructions} />
        </Section>

        {/* Notes */}
        <Section title="Notes" icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
        }>
          <div className="py-3">
            <p className="text-sm text-gray-700 whitespace-pre-line">{job.notes}</p>
          </div>
        </Section>

        {/* Document Upload */}
        <Section title="Documents" icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        }>
          <div className="py-4">
            <p className="text-xs text-gray-500 mb-3">Upload your presentation, feedback forms, or any other required documents for this assignment.</p>
            <label className="w-full border-2 border-dashed border-gray-300 hover:border-green-500 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:text-green-600 transition-colors cursor-pointer">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-medium">Click to upload</span>
              <input type="file" multiple className="hidden" onChange={handleDocUpload} />
            </label>
            {documents.length > 0 && (
              <ul className="mt-3 space-y-2">
                {documents.map((d, i) => (
                  <li key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                    <span className="truncate font-medium text-gray-700 flex-1">{d.name}</span>
                    <span className="text-gray-400 text-xs mx-2">{(d.size / 1024).toFixed(0)} KB</span>
                    <button onClick={() => setDocuments((p) => p.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        {/* Read Confirmation */}
        <div className={`bg-white rounded-xl border-2 p-6 ${confirmed ? 'border-green-400' : 'border-orange-300'}`}>
          <h2 className="font-bold text-gray-900 mb-4">Confirm You Have Read All Details</h2>

          {confirmed ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-300 rounded-xl">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">Confirmed — All details read</p>
                <p className="text-xs text-green-600">You confirmed reading all assignment details.</p>
              </div>
            </div>
          ) : (
            <>
              <label className="flex items-start gap-3 cursor-pointer group mb-5">
                <div className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${hasRead ? 'bg-green-600 border-green-600' : 'border-gray-400 group-hover:border-green-500'}`}
                  onClick={() => setHasRead((v) => !v)}>
                  {hasRead && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input type="checkbox" checked={hasRead} onChange={(e) => setHasRead(e.target.checked)} className="hidden" />
                <span className="text-sm text-gray-700">
                  I have read and understood all details of this assignment, including the address, contact information, directions, parking, safety instructions, and notes.
                </span>
              </label>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-5 text-xs text-blue-700">
                <strong>Reminder:</strong> If you have not confirmed reading these details, you will receive automatic reminders <strong>14 days</strong> and <strong>2 days</strong> before the assignment — both by email and in the portal.
              </div>

              <button
                onClick={handleConfirm}
                disabled={!hasRead}
                className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm — I Have Read Everything
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
