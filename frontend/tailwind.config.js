/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GitHub Dark Mode Colors with Variations
        'gh-bg': '#0d1117',
        'gh-bg-secondary': '#161b22',
        'gh-bg-tertiary': '#21262d',
        'gh-bg-hover': '#262c36',
        'gh-border': '#30363d',
        'gh-border-muted': '#21262d',
        'gh-text': '#e6edf3',
        'gh-text-secondary': '#8b949e',
        'gh-text-tertiary': '#6e7681',
        'gh-accent': '#34d399',
        'gh-accent-hover': '#22c55e',
        'gh-success': '#3fb950',
        'gh-success-light': '#26843b',
        'gh-danger': '#f85149',
        'gh-danger-light': '#da3633',
        'gh-warning': '#d29922',
        'gh-warning-light': '#9e6a03',
        'gh-info': '#34d399',
        'gh-info-light': '#22c55e',
        'gh-purple': '#bc8ef7',
        'gh-purple-light': '#6e40aa',
        'gh-pink': '#f778ba',
        'gh-pink-light': '#ae3a7a',
        // Futuristic light palette
        'future-bg': '#f3f7ff',
        'future-surface': 'rgba(255, 255, 255, 0.82)',
        'future-surface-strong': 'rgba(250, 255, 250, 0.95)',
        'future-border': 'rgba(45, 212, 191, 0.25)',
        'future-muted': '#5c6c74',
        'future-glow': 'rgba(16, 185, 129, 0.32)',
        'future-secondary': '#34d399',
        'future-secondary-dark': '#0d9488',
        'future-highlight': '#bbf7d0',
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      },
      backgroundColor: {
        'dark': '#0d1117',
        'dark-secondary': '#161b22',
        'dark-tertiary': '#21262d',
      },
      textColor: {
        'dark': '#e6edf3',
        'dark-secondary': '#8b949e',
      },
      borderColor: {
        'dark': '#30363d',
      },
      boxShadow: {
        glow: '0 30px 80px -20px rgba(16, 185, 129, 0.45)',
        halo: '0 0 0 1px rgba(52, 211, 153, 0.35)',
      },
      backdropBlur: {
        xs: '6px',
      },
      backgroundImage: {
        'future-radial': 'radial-gradient(120% 120% at 18% 18%, rgba(16, 185, 129, 0.22), transparent 65%), radial-gradient(130% 150% at 80% 25%, rgba(13, 148, 136, 0.18), transparent 65%)',
        'future-grid': 'linear-gradient(90deg, rgba(16, 185, 129, 0.14) 1px, transparent 1px), linear-gradient(0deg, rgba(16, 185, 129, 0.14) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
