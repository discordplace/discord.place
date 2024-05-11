import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Discord Place Docs',
  titleTemplate: ':title │ Discord Place',
  description: 'This website is a documentation on how you can use the Discord Place API.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-WEX8LKYTTD' }],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-WEX8LKYTTD');`
    ]
  ],
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          {
            text: 'Creating a API Key',
            link: '/getting-started/api'
          },
          {
            text: 'Authenticating with API Key',
            link: '/getting-started/auth'
          }
        ]
      },
      {
        text: 'Endpoints',
        items: [
          {
            text: 'GET /bots/:id/votes/:user_id',
            link: '/endpoints/votes'
          },
          {
            text: 'PATCH /bots/:id/stats',
            link: '/endpoints/stats'
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    logo: {
      light: '/assets/symbol_black.png',
      dark: '/assets/symbol_white.png',
      alt: 'Discord Place Logo'
    },

    search: {
      provider: 'local'
    }
  }
})
