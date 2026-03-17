import React, { createContext, useContext, useState, useMemo } from 'react';

export const darkTheme = {
  colors: {
    primary: '#0a84ff',
    background: '#1a1a1c',
    surface: '#2c2c2e',
    text: '#ffffff',
    textMuted: '#8e8e93',
    textOnPrimary: '#ffffff',
    border: '#3a3a3c',
    success: '#34c759',
    danger: '#ff3b30',
    warning: '#ff9500',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  fontSize: { sm: 14, md: 16, lg: 18, xl: 24 },
  radius: { sm: 8, md: 12, lg: 16 },
  shadowCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;

export const lightTheme = {
  colors: {
    primary: '#2563eb',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textMuted: '#64748b',
    textOnPrimary: '#ffffff',
    border: '#e2e8f0',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  fontSize: { sm: 14, md: 16, lg: 18, xl: 24 },
  radius: { sm: 8, md: 12, lg: 16 },
  shadowCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;

export type Theme = typeof darkTheme;

type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Provides dark/light UI theme only. Task state lives in useTasks, not here. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const value = useMemo(
    () => ({
      theme: isDark ? darkTheme : lightTheme,
      isDark,
      toggleTheme: () => setIsDark((d) => !d),
    }),
    [isDark]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/** @deprecated Use useTheme() for theme-aware components. Kept for non-component usage. */
export const theme = darkTheme;
