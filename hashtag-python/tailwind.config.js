/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a18',
        card: '#111128',
        cardHover: '#161632',
        border: '#1e1e40',
        borderHover: '#2d2d60',
        purple: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          dark: '#5b21b6',
          dim: '#2d1b69',
          faint: '#1a1040'
        },
        muted: '#4a4a7a',
        subtle: '#8888aa'
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    }
  },
  plugins: []
}
