import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      mode: 'light',

      // Alternar entre claro e escuro
      toggleMode: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'light' ? 'dark' : 'light';
        set({ mode: newMode });
      },

      // Definir modo específico
      setMode: (mode: ThemeMode) => {
        set({ mode });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Hook para usar o tema
export const useTheme = () => {
  const { mode, toggleMode, setMode } = useThemeStore();
  
  return {
    mode,
    toggleMode,
    setMode,
    isDark: mode === 'dark',
    isLight: mode === 'light',
  };
};