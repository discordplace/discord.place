/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './*.jsx'
  ],
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
  theme: {
    extend: {
      backgroundColor: {
        background: 'rgba(var(--bg-background))',
        quaternary: 'rgba(var(--bg-quaternary))',
        secondary: 'rgba(var(--bg-secondary))',
        tertiary: 'rgba(var(--bg-tertiary))'
      },
      borderColor: {
        primary: 'rgba(var(--border-primary))'
      },
      fill: {
        primary: 'rgba(var(--bg-background))',
        quaternary: 'rgba(var(--bg-quaternary))',
        secondary: 'rgba(var(--bg-secondary))',
        tertiary: 'rgba(var(--bg-tertiary))'
      },
      fontFamily: {
        geist: ['var(--font-geist-sans)', 'sans']
      },
      gradientColorStops: {
        primary: 'rgba(var(--bg-background))',
        quaternary: 'rgba(var(--bg-quaternary))',
        secondary: 'rgba(var(--bg-secondary))',
        tertiary: 'rgba(var(--bg-tertiary))'
      },
      placeholderColor: {
        primary: 'rgba(var(--text-placeholder))'
      },
      screens: {
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
