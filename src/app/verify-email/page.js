'use client';

import { useEffect, useMemo, useState } from 'react';
import Toast from '@/components/Toast';

export default function VerifyEmailPage() {
  const [toast, setToast] = useState(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const queryEmail = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return new URL(window.location.href).searchParams.get('email') ?? '';
  }, []);

  useEffect(() => {
    // Redirect already-verified/logged-in users to dashboard
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'same-origin' });
        const json = await res.json();
        if (res.ok && json.ok) {
          window.location.href = json.redirectTo ?? '/freelancer/dashboard';
          return;
        }
      } catch {
        // not logged in, stay on page
      }
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('pending_verify_email') : '';
      setEmail((queryEmail || stored || '').trim());
    })();
  }, [queryEmail]);

  const handleResend = async () => {
    if (!email) {
      showToast('Missing email. Please go to signup again.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        showToast(json.error ?? 'Could not resend email', 'error');
        return;
      }
      showToast(json.message ?? 'Verification email sent.', 'success');
    } catch (e) {
      showToast(e?.message ?? 'Could not resend email', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
        <p className="text-gray-600 mb-6">
          Your account was created, but you must verify your email before you can access the freelancer dashboard.
        </p>

        <button
          onClick={handleResend}
          disabled={isLoading || !email}
          className="mt-4 w-full bg-linear-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </span>
          ) : 'Resend verification email'}
        </button>

        <div className="mt-6 text-center text-gray-700">
          {!email ? (
            <a href="/signup" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
              Go to signup
            </a>
          ) : (
            <a href="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
              Back to login
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

