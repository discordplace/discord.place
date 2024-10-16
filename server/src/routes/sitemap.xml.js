// sitemap.xml

const xml = require('xml');
const axios = require('axios');

const Profile = require('@/schemas/Profile');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Template = require('@/schemas/Template');
const Sound = require('@/schemas/Sound');
const Theme = require('@/schemas/Theme');

async function getBlogs() {
  try {
    const response = await axios.get(config.frontendUrl + '/api/blogs');
    return response.data;
  } catch (error) {
    logger.error('There was an error while fetching blogs:', error);
    
    return [];
  }
}

module.exports = {
  get: async (request, response) => {
    response.setHeader('Content-Type', 'application/xml');

    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();

    const blogs = await getBlogs();

    const pagesUpdatedMonthly = [
      'https://docs.discord.place/',
      'https://status.discord.place/',
      'https://discord.place/premium',
      'https://discord.place/blogs',
      'https://discord.place/legal/privacy',
      'https://discord.place/legal/terms',
      'https://discord.place/legal/cookie-policy',
      'https://discord.place/legal/content-policy',
      'https://discord.place/legal/purchase-policy'
    ];

    const pagesUpdatedDaily = [
      'https://discord.place/profiles',
      'https://discord.place/servers',
      'https://discord.place/bots',
      'https://discord.place/emojis',
      'https://discord.place/templates',
      'https://discord.place/sounds',
      'https://discord.place/themes'
    ];

    const [profiles, servers, bots, emojis, emojiPacks, templates, sounds, themes] = await Promise.all([
      Profile.find({}).select('slug').lean(),
      Server.find({}).select('id').lean(),
      Bot.find({ verified: true }).select('id').lean(),
      Emoji.find({ verified: true }).select('id').lean(),
      EmojiPack.find({ verified: true }).select('id').lean(),
      Template.find({ verified: true }).select('id').lean(),
      Sound.find({ verified: true }).select('id').lean(),
      Theme.find({ verified: true }).select('id').lean()
    ]);

    const xmlObject = {
      urlset: [
        {
          _attr: {
            xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
          }
        },
        {
          url: [
            { loc: 'https://discord.place/' },
            { lastmod: currentMonthStart },
            { changefreq: 'monthly' },
            { priority: 1.0 }
          ]
        },
        ...pagesUpdatedDaily.map(page => ({
          url: [
            { loc: page },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.9 }
          ]
        })),
        ...profiles.map(({ slug }) => ({
          url: [
            { loc: `https://discord.place/profile/${slug}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...servers.map(({ id }) => ({
          url: [
            { loc: `https://discord.place/servers/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...bots.map(({ id }) => ({
          url: [
            { loc: `https://discord.place/bots/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...emojis.map(({ id }) => ({
          url: [
            { loc: `https://discord.place/emojis/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...emojiPacks.map(({ id }) => ({
          url: [
            { loc: `https://discord.place/emojis/packages/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...templates.map(({ id }) => ({
          url: [
            { loc: `https://discord.place/templates/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...sounds.map(({ id }) => ({
          url: [
            { loc: `https://discord.place/sounds/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...themes.map(({ id }) => ({
          url: [
            { loc: `https://discord.place/themes/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...pagesUpdatedMonthly.map(page => ({
          url: [
            { loc: page },
            { lastmod: currentMonthStart },
            { changefreq: 'monthly' },
            { priority: 0.6 }
          ]
        })),
        ...blogs.map(blog => ({
          url: [
            { loc: `https://discord.place/blogs/${blog.id}` },
            { lastmod: new Date(blog.date).toISOString() },
            { changefreq: 'monthly' },
            { priority: 0.5 }
          ]
        }))
      ]
    };

    const sitemap = xml(xmlObject, { declaration: true });

    return response.send(sitemap);
  }
};