/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://discord.place',
  generateRobotsTxt: true,
  exclude: [
    '/dashboard',
    '/dashboard/*',
    '/account'
  ],
  sitemapSize: 5000
};