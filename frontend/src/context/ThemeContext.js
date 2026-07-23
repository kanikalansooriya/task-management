import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const ThemeContext = createContext(undefined);
const STORAGE_KEY = 'task-manager-theme';
const getSystemTheme = () => {
    if (typeof window === 'undefined') {
        return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
};
const getInitialTheme = () => {
    if (typeof window === 'undefined') {
        return 'dark';
    }
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : getSystemTheme();
};
export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(getInitialTheme);
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
        window.localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);
    const value = useMemo(() => ({
        theme,
        toggleTheme: () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')),
        setTheme: (nextTheme) => setThemeState(nextTheme),
    }), [theme]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used inside a ThemeProvider');
    }
    return context;
};
