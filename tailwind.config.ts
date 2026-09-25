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

        // Named luxury craft palette (Preserved Prussian Blue + Emerald Green + Warm Gold)
        parchment: '#FBF7F0',
        sandstone: '#F5EFEB',
        lapis: '#00405C',
        terracotta: '#00405C', // Replaced terracotta red with brand Prussian blue
        brass: '#C5A880',
        charcoal: '#141A1F',
        stone: '#4A5568',
        chiseled: '#EFE6DC',

        // Code.html design system color tokens mapped strictly to our brand site colors
        primary: '#00405C', // Prussian Navy Blue
        'on-primary': '#FFFFFF',
        'primary-container': '#003248',
        'on-primary-container': '#FFFFFF',
        'primary-fixed': '#D6E3FF',
        'primary-fixed-dim': '#C5A880',
        'on-primary-fixed-variant': '#002538',

        tertiary: '#1E4B3E', // Forest Emerald
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#14362C',
        'on-tertiary-container': '#E6F4EE',
        'tertiary-fixed': '#25D366',
        'tertiary-fixed-dim': '#A1D0BF',

        secondary: '#00405C',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#003248',
        'secondary-fixed': '#D6E3FF',

        surface: '#FBF7F0', // Antique Warm Cream Base
        'surface-bright': '#FFFFFF',
        'surface-dim': '#F5EFEB',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#FBF7F0',
        'surface-container': '#F5EFEB',
        'surface-container-high': '#EFE6DC',
        'surface-container-highest': '#E2D7C8',
        'surface-variant': '#EFE6DC',
        'on-surface': '#1A2024', // Deep Charcoal
        'on-surface-variant': '#4A5568', // Body Charcoal
        'outline': '#867369',
        'outline-variant': '#D9C2B6',

        'inverse-surface': '#141A1F',
        'inverse-on-surface': '#FBF7F0',
        'inverse-primary': '#C5A880',
      },
      fontFamily: {
        headline: ['var(--font-syne)', 'Syne', 'sans-serif'],
        syne: ['var(--font-syne)', 'Syne', 'sans-serif'],
        serif: ['var(--font-caslon)', 'Libre Caslon Text', 'Georgia', 'serif'],
        body: ['var(--font-caslon)', 'Libre Caslon Text', 'Georgia', 'serif'],
        caslon: ['var(--font-caslon)', 'Libre Caslon Text', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],

        // code.html typography utility font families
        'label-md': ['var(--font-syne)', 'sans-serif'],
        'headline-sm': ['var(--font-syne)', 'sans-serif'],
        'headline-lg': ['var(--font-syne)', 'sans-serif'],
        'body-md': ['var(--font-caslon)', 'serif'],
        'display-xl': ['var(--font-syne)', 'sans-serif'],
        'body-sm': ['var(--font-caslon)', 'serif'],
        'label-sm': ['var(--font-syne)', 'sans-serif'],
        'headline-md': ['var(--font-syne)', 'sans-serif'],
        'body-lg': ['var(--font-caslon)', 'serif'],
        'headline-lg-mobile': ['var(--font-syne)', 'sans-serif'],
        'label-lg': ['var(--font-syne)', 'sans-serif'],
        'display-xl-mobile': ['var(--font-syne)', 'sans-serif'],
      },
      fontSize: {
        'label-sm': ['0.6875rem', { lineHeight: '0.875rem', letterSpacing: '0.12em', fontWeight: '600' }],
        'label-md': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.1em', fontWeight: '600' }],
        'label-lg': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.08em', fontWeight: '700' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5rem', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.75rem', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-lg': ['1.25rem', { lineHeight: '2rem', letterSpacing: '0.01em', fontWeight: '400' }],
        'headline-sm': ['1.375rem', { lineHeight: '1.875rem', letterSpacing: '0em', fontWeight: '600' }],
        'headline-md': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['4.5rem', { lineHeight: '5rem', letterSpacing: '-0.03em', fontWeight: '800' }],
      },
      spacing: {
        gutter: '2rem',
        'gutter-mobile': '1rem',
        'margin-mobile': '1.25rem',
        'margin-tablet': '2rem',
        margin: '4rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.75rem',
        'space-xl': '3rem',
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
