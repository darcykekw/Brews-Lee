import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Brand palette (CSS custom properties) ────────────────────
        base:   'var(--color-base)',    // #F9F8F6 / dark: #120D08
        subtle: 'var(--color-subtle)', // #EFE9E3 / dark: #1E1410
        muted:  'var(--color-muted)',  // #D9CFC7 / dark: #3A2D24
        accent: 'var(--color-accent)', // #C9B59C (same both modes)

        // ─── Legacy tokens (kept for backward compat) ──────────────────
        cream: {
          50: '#fdfaf5',
          100: '#faf3e0',
          200: '#f5e6c0',
          300: '#efd4a0',
        },
        espresso: {
          700: '#3d1f0a',
          800: '#2a1206',
          900: '#1a0a02',
        },
        caramel: {
          400: '#d4a055',
          500: '#c08a3a',
          600: '#a87228',
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)',    'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia',   'serif'],
      },
      boxShadow: {
        'nav': '0 1px 0 0 var(--color-muted)',
        'nav-scrolled': '0 2px 12px 0 rgba(28,18,9,0.08)',
      },
      animation: {
        'fade-in':  'fadeIn 0.6s ease-in-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'drawer-in': 'drawerIn 0.25s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawerIn: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
