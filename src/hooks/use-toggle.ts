import { create } from "zustand";

interface ToggleState {
  isSettingsModalOpen: boolean;
  setToggleSettingsModal: (isSettingsModalOpen: boolean) => void;
}

const useToggleStore = create<ToggleState>((set, get) => ({
  isSettingsModalOpen: false,
  setToggleSettingsModal: (isSettingsModalOpen: boolean) =>
    set({ isSettingsModalOpen }),
}));

export default useToggleStore;
