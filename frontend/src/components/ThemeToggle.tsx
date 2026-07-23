import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition ${className}`.trim()}
      style={{
        borderColor: 'var(--card-border)',
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
      }}
    >
      <span aria-hidden="true" className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
};

export default ThemeToggle;
