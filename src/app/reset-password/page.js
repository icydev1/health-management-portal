'use client';

import { useEffect, useState } from 'react';
import Toast from '@/components/Toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [resetCreds, setResetCreds] = useState({ code: null, access_token: null, refresh_token: null });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const access_token = hash.get('access_token');
    const refresh_token = hash.get('refresh_token');

    setResetCreds({
      code,
      access_token,
      refresh_token,
    });
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const payload = { newPassword: password };
      if (resetCreds.code) payload.code = resetCreds.code;
      if (resetCreds.access_token && resetCreds.refresh_token) {
        payload.access_token = resetCreds.access_token;
        payload.refresh_token = resetCreds.refresh_token;
      }

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        showToast(json.error ?? 'Reset failed', 'error');
        return;
      }
      showToast('Password reset successfully!', 'success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 800);
    } catch (err) {
      showToast(err?.message ?? 'Reset failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-linear-to-br from-green-400 to-green-600 rounded-xl mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                required
              />
              <p className="text-xs text-gray-500 mt-2">At least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Resetting...
                </span>
              ) : 'Reset Password'}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-gray-700 mt-6">
            Remember your password?{' '}
            <a href="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
