import { create } from "zustand";

export const useGlobalRefetch = create((set) => ({
  globalRefetch: false,
  setGlobalRefetch: (globalRefetch) => set({ globalRefetch }),
}));
