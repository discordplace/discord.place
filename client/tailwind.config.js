/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
        placeholder: 'rgba(var(--text-placeholder))',
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
        tertiary: 'rgba(var(--bg-tertiary))'
      },
      fill: {
        primary: 'rgba(var(--bg-background))',
        secondary: 'rgba(var(--bg-secondary))',
        tertiary: 'rgba(var(--bg-tertiary))'
      },
      borderColor: {
        primary: 'rgba(var(--border-primary))'
      },
      animation: {
        shine: 'shine 1s infinite ease-in-out',
        loading: 'loading 3s infinite cubic-bezier(.48, -0.03, .12, .97)',
        'logo-spin': 'logo-spin 1.5s forwards cubic-bezier(.83,-0.16,.04,1.36)'
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
        }
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography')
  ]
};