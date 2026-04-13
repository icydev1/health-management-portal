'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';

const REGIONS = [
  { value: 'NORD_WEST',          label: 'North West' },
  { value: 'BAYERN',             label: 'Bayern' },
  { value: 'BERLIN_BRANDENBURG', label: 'Berlin / Brandenburg' },
  { value: 'SACHSEN',            label: 'Sachsen' },
];

const LANGUAGES = [
  'German',
  'English',
  'French',
  'Spanish',
  'Italian',
  'Portuguese',
  'Dutch',
  'Polish',
  'Turkish',
  'Arabic',
  'Russian',
  'Chinese (Mandarin)',
  'Japanese',
  'Korean',
];

function EditFreelancerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', region: '', role: 'FREELANCER', accountStatus: 'PENDING', languages: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const isSuperadmin = useSelector((state) => state.auth.is_superadmin);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    (async () => {
      try {
        const res = await fetch(`/api/admin/freelancers/${id}`, { credentials: 'same-origin' });
        const json = await res.json();
        if (!res.ok || !json.ok) { setNotFound(true); return; }
        const p = json.profile;
        setForm({
          firstName:     p.firstName     ?? '',
          lastName:      p.lastName      ?? '',
          email:         p.email         ?? '',
          region:        p.region        ?? '',
          role:          p.role          ?? 'FREELANCER',
          accountStatus: p.accountStatus ?? 'PENDING',
          languages:     p.languages     ?? [],
        });
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/freelancers/${id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) { setError(json.error ?? 'Failed to update.'); return; }
      setSuccess(true);
      setTimeout(() => router.push('/admin/freelancers'), 1500);
    } catch (e) {
      setError(e?.message ?? 'Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="space-y-4 max-w-2xl">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 space-y-5">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-md">
          Freelancer not found. <a href="/admin/freelancers" className="underline font-medium">Go back</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/freelancers')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors font-semibold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Freelancers
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Freelancer</h1>
        <p className="text-gray-600">Update freelancer account details</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-300 text-green-700 rounded-lg font-medium">
          ✓ Freelancer updated successfully! Redirecting…
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
                type="text" name="firstName" value={form.firstName} onChange={handleChange}
                placeholder="John" required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Last Name *</label>
              <input
                type="text" name="lastName" value={form.lastName} onChange={handleChange}
                placeholder="Doe" required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address *</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="john@example.com" required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Region</label>
              <select
                name="region" value={form.region} onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
              >
                <option value="">— Select region —</option>
                {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            {isSuperadmin ? (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Role</label>
                <select
                  name="role" value={form.role} onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
                >
                  <option value="FREELANCER">Freelancer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Role</label>
                <div className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg bg-gray-50 text-gray-500 text-sm">
                  {form.role === 'ADMIN' ? 'Admin' : 'Freelancer'}
                  <span className="ml-2 text-xs text-gray-400">(only superadmin can change)</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Account Status</label>
            <select
              name="accountStatus" value={form.accountStatus} onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
            >
              <option value="ACTIVE">Active — can log in</option>
              <option value="PENDING">Pending — login blocked</option>
              <option value="INACTIVE">Inactive — login blocked</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Only <strong>Active</strong> accounts can log in to the platform.
            </p>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Languages</label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  setForm((prev) =>
                    prev.languages.includes(val)
                      ? prev
                      : { ...prev, languages: [...prev.languages, val] }
                  );
                  e.target.value = '';
                }}
                defaultValue=""
              >
                <option value="" disabled>— Add a language —</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            {form.languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.languages.map((lang) => (
                  <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">
                    {lang}
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang) }))}
                      className="text-blue-400 hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            {form.languages.length === 0 && (
              <p className="text-xs text-gray-400 mt-2">No languages added yet.</p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit" disabled={saving || success}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : 'Save Changes'}
            </button>
            <button
              type="button" onClick={() => router.push('/admin/freelancers')} disabled={saving}
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

export default function EditFreelancerPage() {
  return (
    <Suspense>
      <EditFreelancerForm />
    </Suspense>
  );
}
