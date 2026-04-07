import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hydrated: false,
  isAuthenticated: false,
  role: null,
  is_superadmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    markHydrated(state) {
      state.hydrated = true;
    },
    setAuth(state, action) {
      state.hydrated = true;
      state.isAuthenticated = true;
      state.role = action.payload?.role ?? null;
      state.is_superadmin = Boolean(action.payload?.is_superadmin);
    },
    setUnauthenticated(state) {
      state.hydrated = true;
      state.isAuthenticated = false;
      state.role = null;
      state.is_superadmin = false;
    },
    clearAuth(state) {
      state.hydrated = true;
      state.isAuthenticated = false;
      state.role = null;
      state.is_superadmin = false;
    },
  },
});

export const { markHydrated, setAuth, setUnauthenticated, clearAuth } = authSlice.actions;
export default authSlice.reducer;
