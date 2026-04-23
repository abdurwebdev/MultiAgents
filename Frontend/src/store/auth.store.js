// store/auth.store.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true, // ✅ start true (important)

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  setAuth: (status) =>
    set({
      isAuthenticated: status,
      loading: false,
    }),

  setLoading: (loading) => set({ loading }),
}));