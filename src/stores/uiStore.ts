import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface UIStore {
  // Sidebar (desktop)
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Bottom sheet (mobile)
  activeSheet: string | null;
  openSheet: (sheetId: string) => void;
  closeSheet: () => void;

  // Modals
  activeModal: string | null;
  modalData: unknown;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;

  // Toast notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Player mini bar visibility
  isPlayerBarVisible: boolean;
  setPlayerBarVisible: (visible: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;

  // Filters
  activeFilters: {
    genre: string | null;
    difficulty: string | null;
  };
  setFilter: (key: 'genre' | 'difficulty', value: string | null) => void;
  clearFilters: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Sidebar
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Bottom sheet
  activeSheet: null,
  openSheet: (sheetId) => set({ activeSheet: sheetId }),
  closeSheet: () => set({ activeSheet: null }),

  // Modals
  activeModal: null,
  modalData: null,
  openModal: (modalId, data) => set({ activeModal: modalId, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto-remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Player bar
  isPlayerBarVisible: false,
  setPlayerBarVisible: (visible) => set({ isPlayerBarVisible: visible }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearchFocused: false,
  setSearchFocused: (focused) => set({ isSearchFocused: focused }),

  // Filters
  activeFilters: {
    genre: null,
    difficulty: null,
  },
  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [key]: value },
    })),
  clearFilters: () =>
    set({
      activeFilters: { genre: null, difficulty: null },
    }),
}));
