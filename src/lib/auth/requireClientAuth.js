'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export function useRequireClientAuth({ role }) {
  const hydrated = useSelector((s) => s.auth.hydrated);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const roleInStore = useSelector((s) => s.auth.role);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (role && roleInStore && roleInStore !== role) {
      window.location.href = roleInStore === 'ADMIN' ? '/admin/dashboard' : '/freelancer/dashboard';
    }
  }, [hydrated, isAuthenticated, roleInStore, role]);
}
