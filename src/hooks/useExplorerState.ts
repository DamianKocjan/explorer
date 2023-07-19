import { create } from "zustand";

type ExplorerState = {
  currentPath: string;
  setCurrentPath: (path: string) => void;
};

export const useExplorerState = create<ExplorerState>((set) => ({
  currentPath: "",
  setCurrentPath: (path) => set({ currentPath: path }),
}));
