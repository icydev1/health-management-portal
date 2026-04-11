'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const REGION_LABELS = {
  NORD_WEST: 'North West',
  BAYERN: 'Bayern',
  BERLIN_BRANDENBURG: 'Berlin / Brandenburg',
  SACHSEN: 'Sachsen',
};

const REQUIRED_COLS = ['firstName', 'lastName', 'email'];

// Parse a CSV string into array of objects using the header row
function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
    return obj;
  });
}

function StatusBadge({ status }) {
  const styles = {
    ACTIVE:   'bg-green-100 text-green-700',
    PENDING:  'bg-yellow-100 text-yellow-700',
    INACTIVE: 'bg-gray-100 text-gray-600',
  };
  const labels = { ACTIVE: 'Active', PENDING: 'Pending', INACTIVE: 'Inactive' };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {labels[status] ?? status}
    </span>
  );
}

function RoleBadge({ role }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
      role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
    }`}>
      {role === 'ADMIN' ? 'Admin' : 'Freelancer'}
    </span>
  );
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRole, setFilterRole] = useState('FREELANCER');
  const isSuperadmin = useSelector((state) => state.auth.is_superadmin);

  // Delete state
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Import state
  const [importOpen, setImportOpen] = useState(false);
  const [csvRows, setCsvRows] = useState([]);
  const [csvError, setCsvError] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef(null);

  const fetchFreelancers = async (q = search, s = filterStatus, r = filterRole) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (s !== 'ALL') params.set('status', s);
      if (r !== 'ALL') params.set('role', r);
      const res = await fetch(`/api/admin/freelancers?${params}`, { credentials: 'same-origin' });
      const json = await res.json();
      if (res.ok && json.ok) setFreelancers(json.freelancers);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFreelancers(); }, []); // eslint-disable-line

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchFreelancers(e.target.value, filterStatus);
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
    fetchFreelancers(search, e.target.value, filterRole);
  };

  const handleRoleFilter = (e) => {
    setFilterRole(e.target.value);
    fetchFreelancers(search, filterStatus, e.target.value);
  };

  // CSV file picker
  const handleFileChange = (e) => {
    setCsvError(null);
    setCsvRows([]);
    setImportResult(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCsv(ev.target.result);
      const missing = REQUIRED_COLS.filter((c) => rows.length > 0 && !(c in rows[0]));
      if (missing.length) {
        setCsvError(`Missing columns: ${missing.join(', ')}. Required: firstName, lastName, email`);
        return;
      }
      setCsvRows(rows);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/freelancers/${deleteId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const json = await res.json();
      if (!res.ok || !json.ok) { setDeleteError(json.error ?? 'Failed to delete.'); return; }
      setDeleteId(null);
      fetchFreelancers();
    } catch (e) {
      setDeleteError(e?.message ?? 'Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };

  const handleImport = async () => {
    if (!csvRows.length) return;
    setImporting(true);
    setImportResult(null);
    try {
      const res = await fetch('/api/admin/import-freelancers', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: csvRows }),
      });
      const json = await res.json();
      setImportResult(json);
      if (json.ok) { setCsvRows([]); fetchFreelancers(); }
    } catch (e) {
      setImportResult({ ok: false, error: e?.message });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Freelancers</h1>
          <p className="text-gray-600">Manage and onboard freelancers</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setImportOpen(true); setCsvRows([]); setCsvError(null); setImportResult(null); }}
            className="inline-flex items-center gap-2 border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import CSV
          </button>
          <Link href="/admin/freelancers/add">
            <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Freelancer
            </button>
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex gap-3 flex-col md:flex-row">
        <div className="flex-1 relative">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search by first name, last name or email…"
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={handleStatusFilter}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        {isSuperadmin && (
          <select
            value={filterRole}
            onChange={handleRoleFilter}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="FREELANCER">Freelancer</option>
            <option value="ADMIN">Admin</option>
          </select>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : freelancers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    No freelancers found.
                  </td>
                </tr>
              ) : (
                freelancers.map((f) => {
                  const name = f.fullName || `${f.firstName ?? ''} ${f.lastName ?? ''}`.trim() || '—';
                  const initials = name.charAt(0).toUpperCase();
                  return (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {initials}
                          </div>
                          <span className="font-semibold text-gray-900">{name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{f.email}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {f.region ? REGION_LABELS[f.region] ?? f.region : '—'}
                      </td>
                      <td className="px-5 py-4"><RoleBadge role={f.role} /></td>
                      <td className="px-5 py-4"><StatusBadge status={f.status} /></td>
                      <td className="px-5 py-4 text-gray-500">
                        {f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/admin/freelancers/${f.id}`}>
                            <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
                              View
                            </button>
                          </Link>
                          <Link href={`/admin/freelancers/edit?id=${f.id}`}>
                            <button className="text-green-600 hover:text-green-800 font-semibold text-sm transition-colors">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => { setDeleteId(f.id); setDeleteName(name); setDeleteError(null); }}
                            className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && freelancers.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            {freelancers.length} record{freelancers.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Freelancer</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to permanently delete <strong>{deleteName}</strong>? Their account, profile, and all associated data will be removed.
            </p>
            {deleteError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteId(null); setDeleteError(null); }}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Deleting…
                  </>
                ) : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {importOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Import Freelancers via CSV</h3>
                <p className="text-sm text-gray-500">Required columns: firstName, lastName, email</p>
              </div>
              <button onClick={() => setImportOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* CSV template hint */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-700">Expected format:</span>
                <a
                  href="/freelancer-import-template.csv"
                  download="freelancer-import-template.csv"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white border border-blue-300 hover:border-blue-500 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Template
                </a>
              </div>
              <div className="font-mono text-xs text-blue-700">
                firstName,lastName,email,region,role<br/>
                John,Doe,john@example.com,NORD_WEST,FREELANCER
              </div>
            </div>

            {/* File picker */}
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={importing}
              className="w-full border-2 border-dashed border-gray-300 hover:border-green-500 rounded-lg py-5 text-gray-500 hover:text-green-600 transition-colors font-medium text-sm mb-4"
            >
              Click to select CSV file
            </button>

            {csvError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{csvError}</p>
            )}

            {csvRows.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">{csvRows.length} row{csvRows.length !== 1 ? 's' : ''} ready to import:</p>
                <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100 text-xs">
                  {csvRows.map((r, i) => (
                    <div key={i} className="px-3 py-2 flex gap-3 text-gray-600">
                      <span className="font-medium text-gray-900">{r.firstName} {r.lastName}</span>
                      <span>{r.email}</span>
                      {r.region && <span className="text-gray-400">{REGION_LABELS[r.region] ?? r.region}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {importResult && (
              <div className={`mb-4 p-3 rounded-lg text-sm border ${importResult.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {importResult.ok
                  ? `✓ Done — ${importResult.summary.succeeded} created, ${importResult.summary.failed} failed, ${importResult.summary.skipped} skipped. Emails sent with staggered delivery.`
                  : importResult.error ?? 'Import failed.'}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setImportOpen(false)}
                disabled={importing}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
              >
                Close
              </button>
              <button
                onClick={handleImport}
                disabled={importing || !csvRows.length}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {importing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Importing & Sending Emails…
                  </>
                ) : `Import ${csvRows.length || ''} Records`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
