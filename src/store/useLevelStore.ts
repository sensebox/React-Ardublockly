import create from "zustand";

interface LevelState {
  level: number;
  setLevel: (newLevel: number) => void;
}

export const useLevelStore = create<LevelState>((set) => ({
  level: 1,
  setLevel: (newLevel) => set({ level: newLevel }),
}));
