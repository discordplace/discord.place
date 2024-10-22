/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
    './public/profile-badges/*.svg',
    './lib/**/*.{js,jsx}',
    './config.js'
  ],
  darkMode: ['class'],
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography')
  ],
  theme: {
    extend: {
      animation: {
        loading: 'loading 3s infinite cubic-bezier(.48, -0.03, .12, .97)',
        'logo-spin': 'logo-spin 1.5s forwards cubic-bezier(.83,-0.16,.04,1.36)',
        'reportable-area': 'reportable-area 3s infinite ease-in-out',
        'rotate': 'rotate 10s linear infinite',
        'scroll-based-appear': 'scroll-based-appear linear both',
        shine: 'shine 1s infinite ease-in-out'
      },
      backgroundColor: {
        background: 'rgba(var(--bg-background))',
        quaternary: 'rgba(var(--bg-quaternary))',
        secondary: 'rgba(var(--bg-secondary))',
        tertiary: 'rgba(var(--bg-tertiary))'
      },
      borderColor: {
        primary: 'rgba(var(--border-primary))'
      },
      colors: {
        placeholder: 'rgba(var(--text-placeholder))'
      },
      fill: {
        primary: 'rgba(var(--bg-background))',
        quaternary: 'rgba(var(--bg-quaternary))',
        secondary: 'rgba(var(--bg-secondary))',
        tertiary: 'rgba(var(--bg-tertiary))'
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)']
      },
      gradientColorStops: {
        primary: 'rgba(var(--bg-background))',
        quaternary: 'rgba(var(--bg-quaternary))',
        secondary: 'rgba(var(--bg-secondary))',
        tertiary: 'rgba(var(--bg-tertiary))'
      },
      keyframes: {
        loading: {
          '0%': { transform: 'translateX(-100%)', width: '50%' },
          '49.9%': { opacity: 1 },
          '50%': { opacity: 0, transform: 'translateX(205%)' },
          '99.9%': { opacity: 0 },
          '100%': { opacity: 1, transform: 'translateX(-100%)' }
        },
        'logo-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
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
        },
        rotate: {
          '0%': { transform: 'rotate(0deg) scale(10)' },
          '100%': { transform: 'rotate(-360deg) scale(10)' }
        },
        'scroll-based-appear': {
          from: {
            filter: 'blur(2px)',
            transform: 'scale(0.85)'
          },
          to: {
            filter: 'blur(0)',
            opacity: 1,
            transform: 'scale(1)'
          }
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      screens: {
        'emojis-cols-3': '838px',
        mobile: '420px'
      },
      textColor: {
        primary: 'rgba(var(--text-primary))',
        secondary: 'rgba(var(--text-secondary))',
        tertiary: 'rgba(var(--text-tertiary))'
      }
    }
  }
};