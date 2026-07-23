import { jsx as _jsx } from "react/jsx-runtime";
import { useTheme } from '../context/ThemeContext';
const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();
    return (_jsx("button", { type: "button", onClick: toggleTheme, "aria-label": "Toggle theme", className: `inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition ${className}`.trim(), style: {
            borderColor: 'var(--card-border)',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
        }, children: _jsx("span", { "aria-hidden": "true", className: "text-lg", children: theme === 'dark' ? '☀️' : '🌙' }) }));
};
export default ThemeToggle;
