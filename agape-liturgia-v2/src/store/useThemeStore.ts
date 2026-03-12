import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'sepia';
export type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';

interface ThemeState {
  theme: Theme;
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  setFontSize: (size: FontSize) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      fontSize: 'text-base', // Tamanho Normal como padrão
      setTheme: (theme) => set({ theme }),
      cycleTheme: () => {
        const current = get().theme;
        if (current === 'light') set({ theme: 'dark' });
        else if (current === 'dark') set({ theme: 'sepia' });
        else set({ theme: 'light' });
      },
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'agape-theme-storage',
    }
  )
);