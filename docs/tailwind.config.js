/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './*.jsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        geist: ['var(--font-geist-sans)', 'sans']
      },
      screens: {
        mobile: '420px'
      },
      placeholderColor: {
        primary: 'rgba(var(--text-placeholder))'
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
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
  future: {
    hoverOnlyWhenSupported: true
  }
};
