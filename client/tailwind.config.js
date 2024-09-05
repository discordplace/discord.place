/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
    './public/profile-badges/*.svg'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)']
      },
      screens: {
        mobile: '420px',
        'emojis-cols-3': '838px'
      },
      colors: {
        placeholder: 'rgba(var(--text-placeholder))'
      },
      textColor: {
        primary: 'rgba(var(--text-primary))',
        secondary: 'rgba(var(--text-secondary))',
        tertiary: 'rgba(var(--text-tertiary))'
      },
      backgroundColor: {
        background: 'rgba(var(--bg-background))',
        secondary: 'rgba(var(--bg-secondary))',
        tertiary: 'rgba(var(--bg-tertiary))',
        quaternary: 'rgba(var(--bg-quaternary))'
      },
      gradientColorStops: {
        primary: 'rgba(var(--bg-background))',
        secondary: 'rgba(var(--bg-secondary))',
        tertiary: 'rgba(var(--bg-tertiary))',
        quaternary: 'rgba(var(--bg-quaternary))'
      },
      fill: {
        primary: 'rgba(var(--bg-background))',
        secondary: 'rgba(var(--bg-secondary))',
        tertiary: 'rgba(var(--bg-tertiary))',
        quaternary: 'rgba(var(--bg-quaternary))'
      },
      borderColor: {
        primary: 'rgba(var(--border-primary))'
      },
      animation: {
        shine: 'shine 1s infinite ease-in-out',
        loading: 'loading 3s infinite cubic-bezier(.48, -0.03, .12, .97)',
        'logo-spin': 'logo-spin 1.5s forwards cubic-bezier(.83,-0.16,.04,1.36)',
        'scroll-based-appear': 'scroll-based-appear linear both',
        'rotate': 'rotate 10s linear infinite',
        'reportable-area': 'reportable-area 3s infinite ease-in-out'
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        loading: {
          '0%': { transform: 'translateX(-100%)', width: '50%' },
          '49.9%': { opacity: 1 },
          '50%': { transform: 'translateX(205%)', opacity: 0 },
          '99.9%': { opacity: 0 },
          '100%': { opacity: 1, transform: 'translateX(-100%)' }
        },
        'logo-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'scroll-based-appear': {
          from: {
            filter: 'blur(2px)',
            transform: 'scale(0.85)'
          },
          to: {
            opacity: 1,
            filter: 'blur(0)',
            transform: 'scale(1)'
          }
        },
        rotate: {
          '0%': { transform: 'rotate(0deg) scale(10)' },
          '100%': { transform: 'rotate(-360deg) scale(10)' }
        },
        'reportable-area': {
          '0%': {
            backgroundColor: 'rgb(168 85 247 / 0.1)'
          },
          '50%': {
            backgroundColor: 'rgb(168 85 247 / 0.3)'
          },
          '100%': {
            backgroundColor: 'rgb(168 85 247 / 0.1)'
          }
        }
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography')
  ],
  future: {
    hoverOnlyWhenSupported: true
  }
};