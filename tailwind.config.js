/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // mapped to design-system tokens (src/styles/tokens.css)
        paper: 'var(--color-cream)',
        'paper-dark': 'var(--color-cream-dark)',
        card: 'var(--color-card-bg)',
        ink: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        line: 'var(--color-line)',
        clay: 'var(--color-terracotta)',
        'clay-light': 'var(--color-terracotta-light)',
        espresso: 'var(--color-espresso)',
      },
      fontFamily: {
        serif: ['Fraunces', '"Noto Serif TC"', 'Georgia', 'serif'],
        cjk: ['"Noto Serif TC"', 'serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0',
      },
      maxWidth: {
        wide: '1440px',
      },
    },
  },
  plugins: [],
}
