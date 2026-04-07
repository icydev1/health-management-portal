'use client';

import { useEffect, useState } from 'react';
import Toast from '@/components/Toast';
import { logoutViaApi } from '@/lib/auth/tokenStorage';
import { useDispatch } from 'react-redux';
import { setAuth, clearAuth } from '@/store/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'same-origin' });
        const json = await res.json();
        if (res.status === 401) {
          dispatch(clearAuth());
          return;
        }
        if (res.status === 403 && json?.needsVerification) {
          const em = json.email || '';
          if (em) window.localStorage.setItem('pending_verify_email', em);
          window.location.href = em
            ? `/verify-email?email=${encodeURIComponent(em)}`
            : '/verify-email';
          return;
        }
        if (res.ok && json.ok) {
          window.location.href = json.redirectTo ?? '/freelancer/dashboard';
        }
      } catch {
        // ignore
      }
    })();
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await logoutViaApi();
      dispatch(clearAuth());
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json?.needsVerification) {
          window.localStorage.setItem('pending_verify_email', email);
          window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
          return;
        }
        showToast(json.error ?? 'Login failed', 'error');
        return;
      }

      dispatch(setAuth({ role: json.role, is_superadmin: json.is_superadmin }));
      showToast('Login successful!', 'success');
      window.location.href = json.redirectTo ?? '/freelancer/dashboard';
    } catch (err) {
      showToast(err?.message ?? 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-linear-to-br from-green-400 to-green-600 rounded-xl mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.343a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.343 15.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 10-1.414 1.414l.707.707zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM5.343 5.343a1 1 0 01-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                Password
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
            </div>

            {/* Forgot Password Link */}
            <a
              href="/forgot-password"
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Forgot password?
            </a>

            {/* Login Button */}
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
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-700">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
              Sign up as a freelancer
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}
