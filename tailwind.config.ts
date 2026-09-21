import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        card: 'var(--card)',
        'primary-accent': 'var(--primary-accent)',
        'secondary-accent': 'var(--secondary-accent)',
        highlight: 'var(--highlight)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        border: 'var(--border)',

        // Named luxury craft palette
        parchment: '#FAF7F2',
        sandstone: '#F4EFE6',
        lapis: '#1A4268',
        terracotta: '#8F3B1B',
        brass: '#C5A059',
        charcoal: '#1F1D1A',
        stone: '#6E675F',
        chiseled: '#E6DFD5',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'craft-sm': '0 2px 8px -2px rgba(31, 29, 26, 0.06)',
        'craft-md': '0 4px 20px -4px rgba(31, 29, 26, 0.1)',
        'craft-lg': '0 12px 32px -8px rgba(31, 29, 26, 0.15)',
        'brass-glow': '0 0 15px rgba(197, 160, 89, 0.25)',
      },
      aspectRatio: {
        '4/5': '4 / 5',
        '3/4': '3 / 4',
      },
      animation: {
        'ticker-slide': 'ticker 25s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
