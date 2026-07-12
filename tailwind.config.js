/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-bg-canvas)',
        surface: 'var(--color-bg-surface)',
        raised: 'var(--color-bg-surface-raised)',
        overlay: 'var(--color-bg-overlay)',
        ink: {
          DEFAULT: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
        },
        line: {
          subtle: 'var(--color-border-subtle)',
          DEFAULT: 'var(--color-border-default)',
          strong: 'var(--color-border-strong)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          pressed: 'var(--color-primary-pressed)',
          soft: 'var(--color-primary-soft)',
          text: 'var(--color-primary-text)',
        },
        success: {
          bg: 'var(--color-success-bg)',
          surface: 'var(--color-success-surface)',
          border: 'var(--color-success-border)',
          text: 'var(--color-success-text)',
        },
        danger: {
          bg: 'var(--color-danger-bg)',
          surface: 'var(--color-danger-surface)',
          border: 'var(--color-danger-border)',
          text: 'var(--color-danger-text)',
        },
        warning: {
          bg: 'var(--color-warning-bg)',
          surface: 'var(--color-warning-surface)',
          border: 'var(--color-warning-border)',
          text: 'var(--color-warning-text)',
        },
        info: {
          bg: 'var(--color-info-bg)',
          surface: 'var(--color-info-surface)',
          border: 'var(--color-info-border)',
          text: 'var(--color-info-text)',
        },

        /* Compatibility aliases; remove after Sprint 1.6 migration. */
        bg: 'var(--c-bg)',
        card: 'var(--c-card)',
        cardHover: 'var(--c-card2)',
        border: 'var(--c-border)',
        purple: {
          DEFAULT: 'var(--c-purple)',
          light: 'var(--c-purple-l)',
          dark: 'var(--c-purple-d)',
          dim: 'var(--c-purple-dm)',
          faint: 'var(--c-purple-f)',
        },
        muted: 'var(--c-dimmer)',
        subtle: 'var(--c-muted)',
      },
      spacing: {
        18: '4.5rem',
      },
      borderRadius: {
        hpSm: 'var(--radius-sm)',
        hp: 'var(--radius-md)',
        hpLg: 'var(--radius-lg)',
        hpXl: 'var(--radius-xl)',
      },
      boxShadow: {
        hpXs: 'var(--shadow-xs)',
        hpSm: 'var(--shadow-sm)',
        hpMd: 'var(--shadow-md)',
        hpLg: 'var(--shadow-lg)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        display: ['var(--text-display)', { lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tight)' }],
        h1: ['var(--text-h1)', { lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--tracking-tight)' }],
        h2: ['var(--text-h2)', { lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--tracking-tight)' }],
        h3: ['var(--text-h3)', { lineHeight: 'var(--leading-heading)' }],
        title: ['var(--text-title)', { lineHeight: 'var(--leading-heading)' }],
        body: ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
        caption: ['var(--text-caption)', { lineHeight: '1.45' }],
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
      },
    },
  },
  plugins: [],
}
