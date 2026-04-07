'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const NOTIFICATIONS = [
  { key: 'notifyNewOrders',     label: 'New Order Alerts',     description: 'Get notified when new orders are created' },
  { key: 'notifyPayments',      label: 'Payment Alerts',       description: 'Get notified for payment status updates' },
  { key: 'notifyFreelancers',   label: 'Freelancer Alerts',    description: 'Get notified when freelancers submit work' },
  { key: 'notifyEmailDigest',   label: 'Daily Email Digest',   description: 'Receive a daily summary of platform activity' },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      suppressHydrationWarning
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-green-600' : 'bg-gray-300'
      }`}
      role="switch"
      aria-checked={checked ? 'true' : 'false'}
    >
      <span
        suppressHydrationWarning
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const isSuperadmin = useSelector((state) => state.auth.is_superadmin);

  // Business settings (static for now — no DB model yet)
  const [biz, setBiz] = useState({ currency: 'EUR', travelCostRate: '0.30', paymentGateway: 'Stripe', timezone: 'CET' });
  const [savingBiz, setSavingBiz] = useState(false);
  const [savedBiz, setSavedBiz] = useState(false);

  // Notifications (local-only toggles for admin — extend to DB when needed)
  const [notif, setNotif] = useState({ notifyNewOrders: true, notifyPayments: true, notifyFreelancers: true, notifyEmailDigest: false });
  const [savingNotif, setSavingNotif] = useState(false);
  const [savedNotif, setSavedNotif] = useState(false);

  // Change password
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [savedPw, setSavedPw] = useState(false);
  const [errorPw, setErrorPw] = useState(null);

  // Delete account
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => { setMounted(true); }, []);

  const handleSaveBiz = async () => {
    setSavingBiz(true);
    await new Promise((r) => setTimeout(r, 600)); // placeholder — wire to API when ready
    setSavingBiz(false);
    setSavedBiz(true);
    setTimeout(() => setSavedBiz(false), 3000);
  };

  const handleSaveNotif = async () => {
    setSavingNotif(true);
    await new Promise((r) => setTimeout(r, 600));
    setSavingNotif(false);
    setSavedNotif(true);
    setTimeout(() => setSavedNotif(false), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) { setErrorPw('New passwords do not match.'); return; }
    if (pw.next.length < 8) { setErrorPw('New password must be at least 8 characters.'); return; }
    setSavingPw(true);
    setErrorPw(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErrorPw(json.error ?? 'Failed to change password.'); return; }
      setSavedPw(true);
      setPw({ current: '', next: '', confirm: '' });
      setTimeout(() => { setSavedPw(false); setPwOpen(false); }, 2500);
    } catch (e) {
      setErrorPw(e?.message ?? 'Failed to change password.');
    } finally {
      setSavingPw(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch('/api/auth/delete-account', { method: 'DELETE', credentials: 'same-origin' });
      const json = await res.json();
      if (!res.ok || !json.ok) { setDeleteError(json.error ?? 'Failed to delete account.'); return; }
      window.location.href = '/login';
    } catch (e) {
      setDeleteError(e?.message ?? 'Failed to delete account.');
    } finally {
      setDeleting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage business configuration, notifications and security</p>
      </div>

      <div className="space-y-6">

        {/* Business Settings */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Business Settings</h2>
          <p className="text-sm text-gray-500 mb-6">Platform-wide configuration</p>

          {savedBiz && (
            <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm font-medium">
              ✓ Business settings saved!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Currency</label>
              <select
                value={biz.currency}
                onChange={(e) => setBiz((p) => ({ ...p, currency: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Timezone</label>
              <select
                value={biz.timezone}
                onChange={(e) => setBiz((p) => ({ ...p, timezone: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
              >
                <option value="CET">Central European Time (CET)</option>
                <option value="CEST">Central European Summer Time (CEST)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Payment Gateway</label>
              <select
                value={biz.paymentGateway}
                onChange={(e) => setBiz((p) => ({ ...p, paymentGateway: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white"
              >
                <option value="Stripe">Stripe</option>
                <option value="PayPal">PayPal</option>
                <option value="Wise">Wise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Travel Cost Rate</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={biz.travelCostRate}
                  onChange={(e) => setBiz((p) => ({ ...p, travelCostRate: e.target.value }))}
                  step="0.01"
                  min="0"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                />
                <span className="text-gray-600 font-semibold">€/km</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSaveBiz}
              disabled={savingBiz}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {savingBiz ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Notification Settings</h2>
          <p className="text-sm text-gray-500 mb-6">Choose which events you want to be notified about</p>

          {savedNotif && (
            <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm font-medium">
              ✓ Notification preferences saved!
            </div>
          )}

          <div className="space-y-3">
            {NOTIFICATIONS.map(({ key, label, description }) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">{label}</p>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
                <Toggle checked={notif[key]} onChange={() => setNotif((p) => ({ ...p, [key]: !p[key] }))} />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={handleSaveNotif}
              disabled={savingNotif}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {savingNotif ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Security</h2>
          <p className="text-sm text-gray-500 mb-6">Manage your account security</p>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => { setPwOpen((o) => !o); setErrorPw(null); setSavedPw(false); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div>
                <p className="font-semibold text-gray-900">Change Password</p>
                <p className="text-sm text-gray-500">Update your admin account password</p>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${pwOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {pwOpen && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                {savedPw && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm font-medium">
                    ✓ Password changed successfully!
                  </div>
                )}
                {errorPw && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errorPw}</div>
                )}
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {[
                    { label: 'Current Password', key: 'current', placeholder: '••••••••' },
                    { label: 'New Password',     key: 'next',    placeholder: 'Min 8 characters' },
                    { label: 'Confirm New Password', key: 'confirm', placeholder: '••••••••' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
                      <input
                        type="password"
                        value={pw[key]}
                        onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        required
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none bg-white text-gray-900"
                      />
                    </div>
                  ))}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={savingPw}
                      className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {savingPw ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Updating...
                        </>
                      ) : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPwOpen(false); setPw({ current: '', next: '', confirm: '' }); setErrorPw(null); }}
                      className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone — hidden for superadmin */}
        {!isSuperadmin && (
        <div className="bg-white rounded-lg border-2 border-red-200 p-6">
          <h2 className="text-xl font-bold text-red-600 mb-1">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-6">Irreversible actions — proceed with caution</p>
          <div className="bg-red-50 rounded-lg p-5">
            <p className="font-semibold text-gray-900 mb-1">Delete Account</p>
            <p className="text-sm text-gray-600 mb-4">
              Permanently removes this admin account and all associated data. This cannot be undone.
            </p>
            <button
              onClick={() => { setDeleteOpen(true); setDeleteConfirmText(''); setDeleteError(null); }}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold text-sm"
            >
              Delete My Account
            </button>
          </div>
        </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
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
                <h3 className="text-lg font-bold text-gray-900">Delete Admin Account</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Your admin account and all associated data will be permanently deleted.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5">
              <p className="text-sm text-red-700 font-medium mb-2">
                Type <span className="font-bold font-mono bg-red-100 px-1.5 py-0.5 rounded">delete</span> to confirm
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteError(null); }}
                placeholder="Type delete to confirm"
                autoFocus
                className="w-full px-3 py-2 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none bg-white text-gray-900 text-sm"
              />
            </div>

            {deleteError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteOpen(false); setDeleteConfirmText(''); setDeleteError(null); }}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText.toLowerCase() !== 'delete'}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Deleting...
                  </>
                ) : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
