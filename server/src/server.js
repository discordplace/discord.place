const express = require('express');
const { router } = require('express-file-routing');
const path = require('node:path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const ip = require('@/utils/middlewares/ip');
const blockSimultaneousRequests = require('@/utils/middlewares/blockSimultaneousRequests');
const languageDetection = require('@/utils/middlewares/languageDetection');
const compression = require('compression');
const morgan = require('morgan');

const sleep = require('@/utils/sleep');
const User = require('@/schemas/User');

module.exports = class Server {
  constructor() {
    return this;
  }

  create() {
    this.server = express();

    this.server.set('trust proxy', config.trustProxy);
    this.server.disable('x-powered-by');
    this.server.disable('etag');

    return this;
  }

  async start(port = 8000) {
    while (mongoose.connection.readyState !== mongoose.STATES.connected) await sleep(1000);

    this.addMiddlewares();

    this.server.use('/', await router({ directory: path.join(__dirname, 'routes') }));
    this.server.use('/public', express.static(path.join(__dirname, '..', 'public')));
    this.server.use('*', (request, response) => response.sendError('Not Found', 404));

    this.listen(port);
  }

  listen(port) {
    this.server.listen(port, () => logger.info(`Server listening on port ${port}.`));
  }

  addMiddlewares() {
    const morganMiddleware = morgan(':status :method :url from :remote-addr :res[content-length] bytes in :response-time ms', {
      stream: {
        write: message => logger.http(message.trim())
      }
    });

    this.server.use(morganMiddleware);

    this.server.use(compression());
    this.server.use(cookieParser(process.env.COOKIE_SECRET));
    this.server.use(cors({
      origin: [config.frontendUrl],
      credentials: true
    }));
    this.server.use(helmet({
      xXssProtection: false,
      xPoweredBy: false,
      xFrameOptions: { action: 'sameorigin' }
    }));
    this.server.use(ip);
    this.server.use(require('@/utils/middlewares/error'));

    this.server.use((request, response, next) => {
      if (client.blockedIps.has(request.clientIp)) return response.sendError('Forbidden', 403);
      next();
    });

    this.server.use(languageDetection);

    if (process.env.NODE_ENV === 'production' && config.globalRateLimit.enabled === true) this.server.use(require('@/utils/middlewares/globalRateLimiter'));

    this.server.use((request, response, next) => {
      if (config.customHostnames.includes(request.headers.host)) {
        const slashLength = request.url.split('/').filter(Boolean).length;
        if (slashLength > 1) return response.redirect(`${config.frontendUrl}/profiles`);
      }

      next();
    });

    if (process.env.NODE_ENV === 'production') this.server.use(blockSimultaneousRequests);

    this.server.use(async (request, response, next) => {
      if (request.cookies.token) {
        const token = request.cookies.token;

        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: 'api.discord.place',
            audience: 'discord.place',
            subject: 'user'
          });

          if (!decoded) throw new Error('Token invalid.');

          const user = await User.findOne({ id: decoded.id }).select('lastLogoutAt').lean();
          if (!user) throw new Error('User not found.');

          if (decoded.iat < new Date(user.lastLogoutAt).getTime()) throw new Error('Token expired.');

          request.user = {
            id: decoded.id
          };

          const guild = client.guilds.cache.get(config.guildId);
          if (guild) {
            const member = guild.members.cache.get(request.user.id);
            if (member) {
              request.member = member;
            }
          }

          next();
        } catch (error) {
          response.clearCookie('token');

          return response.sendError('Unauthorized', 401);
        }
      } else {
        next();
      }
    });

    logger.info('Middlewares added.');
  }
};