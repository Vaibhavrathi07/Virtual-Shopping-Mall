import { create } from "zustand";

// Drives the 3D scene: which product is highlighted/open, navigation targets,
// map visibility, and audio toggle — kept separate from server data stores.
const useMallStore = create((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  navigateTarget: null, // { x, y, z } — set to guide the player toward a store
  setNavigateTarget: (target) => set({ navigateTarget: target }),

  isMapOpen: false,
  toggleMap: (open) => set((s) => ({ isMapOpen: open ?? !s.isMapOpen })),

  soundOn: false,
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),

  playerPosition: { x: 0, y: 1.6, z: 22 },
  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  controlMode: "keyboard", // "keyboard" | "touch"
  setControlMode: (mode) => set({ controlMode: mode }),

  activeStoreId: null,
  setActiveStoreId: (id) => set({ activeStoreId: id }),

  // Touch input, written by TouchControls and consumed each frame by Player.
  touchMove: { x: 0, z: 0 },
  setTouchMove: (move) => set({ touchMove: move }),
  touchLook: { x: 0, y: 0 },
  setTouchLook: (look) => set({ touchLook: look }),
  consumeTouchLook: () => set({ touchLook: { x: 0, y: 0 } }),
}));

export default useMallStore;
