'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const REGIONS = [
  { value: 'NORD_WEST',          label: 'North West' },
  { value: 'BAYERN',             label: 'Bayern' },
  { value: 'BERLIN_BRANDENBURG', label: 'Berlin / Brandenburg' },
  { value: 'SACHSEN',            label: 'Sachsen' },
];

export default function AddFreelancerPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', region: '', role: 'FREELANCER' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const isSuperadmin = useSelector((state) => state.auth.is_superadmin);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/freelancers', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) { setError(json.error ?? 'Failed to create freelancer.'); return; }
      setSuccess(true);
      setTimeout(() => router.push('/admin/freelancers'), 1800);
    } catch (e) {
      setError(e?.message ?? 'Failed to create freelancer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors font-semibold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Freelancers
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Freelancer</h1>
        <p className="text-gray-600">Create a new freelancer account — a temporary password will be auto-generated and emailed</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-300 text-green-700 rounded-lg font-medium">
          ✓ Freelancer created successfully! Welcome email sent. Redirecting…
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg border-2 border-gray-200 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Region</label>
              <select
                name="region"
                value={form.region}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
              >
                <option value="">— Select region —</option>
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            {isSuperadmin && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
                >
                  <option value="FREELANCER">Freelancer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Auto-generated password</strong> — A secure temporary password will be created automatically and sent to the freelancer&apos;s email address.
            </p>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={saving || success}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating & Sending Email…
                </>
              ) : 'Add Freelancer'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
