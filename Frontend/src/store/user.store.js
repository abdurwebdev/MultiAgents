import { create } from "zustand";

export const useUserStore = create((set) => ({
  profile: null,
  loading: false,
  saving: false,

  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setSaving: (saving) => set({ saving }),
}));