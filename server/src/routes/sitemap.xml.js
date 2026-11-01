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
    const frontendUrl = config.sitemapConfig.useInternalNetworking ? (process.env.INTERNAL_FRONTEND_URL || config.frontendUrl) : config.frontendUrl;
    const response = await axios.get(`${frontendUrl}/api/blogs`);

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
    const frontendUrl = config.frontendUrl;

    const blogs = await getBlogs();

    const pagesUpdatedMonthly = [
      `${config.docsUrl}/`,
      `${config.statusUrl}/`,
      `${frontendUrl}/premium`,
      `${frontendUrl}/blogs`,
      `${frontendUrl}/legal/privacy`,
      `${frontendUrl}/legal/terms`,
      `${frontendUrl}/legal/cookie-policy`,
      `${frontendUrl}/legal/content-policy`,
      `${frontendUrl}/legal/purchase-policy`
    ];

    const pagesUpdatedDaily = [
      `${frontendUrl}/profiles`,
      `${frontendUrl}/servers`,
      `${frontendUrl}/bots`,
      `${frontendUrl}/emojis`,
      `${frontendUrl}/templates`,
      `${frontendUrl}/sounds`,
      `${frontendUrl}/themes`
    ];

    const [profiles, servers, bots, emojis, emojiPacks, templates, sounds, themes] = await Promise.all([
      Profile.find({}).select('slug').lean(),
      Server.find({}).select('id').lean(),
      Bot.find({ verified: true }).select('id').lean(),
      Emoji.find({ approved: true }).select('id').lean(),
      EmojiPack.find({ approved: true }).select('id').lean(),
      Template.find({ approved: true }).select('id').lean(),
      Sound.find({ approved: true }).select('id').lean(),
      Theme.find({ approved: true }).select('id').lean()
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
            { loc: `${frontendUrl}/` },
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
            { loc: `${frontendUrl}/profile/${slug}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...servers.map(({ id }) => ({
          url: [
            { loc: `${frontendUrl}/servers/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...bots.map(({ id }) => ({
          url: [
            { loc: `${frontendUrl}/bots/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...emojis.map(({ id }) => ({
          url: [
            { loc: `${frontendUrl}/emojis/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...emojiPacks.map(({ id }) => ({
          url: [
            { loc: `${frontendUrl}/emojis/packages/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...templates.map(({ id }) => ({
          url: [
            { loc: `${frontendUrl}/templates/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...sounds.map(({ id }) => ({
          url: [
            { loc: `${frontendUrl}/sounds/${id}` },
            { lastmod: currentDate.toISOString() },
            { changefreq: 'daily' },
            { priority: 0.7 }
          ]
        })),
        ...themes.map(({ id }) => ({
          url: [
            { loc: `${frontendUrl}/themes/${id}` },
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
            { loc: `${frontendUrl}/blogs/${blog.id}` },
            { lastmod: new Date(blog.date).toISOString() },
            { changefreq: config.sitemapConfig.blogsChangeFrequency },
            { priority: 0.5 }
          ]
        }))
      ]
    };

    const sitemap = xml(xmlObject, { declaration: true });

    return response.send(sitemap);
  }
};