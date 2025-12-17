import { create } from "zustand"

type LoadingState = {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const useloadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}))