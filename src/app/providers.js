'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { clearAuth, markHydrated, setAuth, setUnauthenticated } from '@/store/authSlice';

function BootstrapAuth() {
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'same-origin' });
        const json = await res.json();
        if (res.status === 401) {
          store.dispatch(clearAuth());
          return;
        }
        if (res.status === 403 && json?.needsVerification) {
          store.dispatch(setUnauthenticated());
          return;
        }
        if (!res.ok || !json.ok) {
          store.dispatch(markHydrated());
          return;
        }
        store.dispatch(setAuth({ role: json.role, is_superadmin: json.is_superadmin }));
      } catch {
        store.dispatch(markHydrated());
      }
    })();
  }, []);

  return null;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <BootstrapAuth />
      {children}
    </Provider>
  );
}
