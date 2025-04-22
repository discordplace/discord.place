const express = require('express');
const { router } = require('express-file-routing');
const path = require('node:path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const ip = require('@/utils/middlewares/ip');
const languageDetection = require('@/utils/middlewares/languageDetection');
const compression = require('compression');
const morgan = require('morgan');

const sleep = require('@/utils/sleep');
const User = require('@/schemas/User');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');

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
    morgan.token('user', request => request.user ? `user ${request.user.id}${request.member ? ` (@${request.member.user.username})` : ''}` : 'guest');

    function customMorgan(tokens, request, response) {
      return [
        tokens.status(request, response),
        tokens.method(request, response),
        tokens.url(request, response),
        'from',
        tokens.user(request),
        'ip',
        request.clientIp,
        tokens['response-time'](request, response),
        'ms'
      ].join(' ');
    }

    const morganMiddleware = morgan(customMorgan, {
      stream: {
        write: message => logger.http(message.trim())
      },
      skip: request => {
        if (request.method === 'OPTIONS') return true;
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
    this.server.use(require('@/utils/middlewares/error'));
    this.server.use(ip);

    this.server.use(languageDetection);

    this.server.use((request, response, next) => {
      if (config.customHostnames.includes(request.headers.host)) {
        const slashLength = request.url.split('/').filter(Boolean).length;
        if (slashLength > 1) return response.redirect(`${config.frontendUrl}/profiles`);
      }

      next();
    });

    this.server.use(async (request, response, next) => {
      if (request.cookies.token) {
        const token = request.cookies.token;
        const tokenRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

        try {
          if (!tokenRegex.test(token)) throw new Error('Invalid token format.');

          const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: 'api.discord.place',
            audience: 'discord.place',
            complete: true,
            clockTolerance: 60
          });

          const user = await User.findOne({ id: decoded.payload.sub }).select('lastLogoutAt').lean();
          if (!user) throw new Error('User not found.');

          if (decoded.iat < Math.floor(new Date(user.lastLogoutAt).getTime() / 1000)) throw new Error('Token expired.');

          const userQuarantined = await findQuarantineEntry.single('USER_ID', decoded.payload.sub, 'LOGIN').catch(() => false);
          if (userQuarantined) throw new Error('User that this token belongs to is not allowed to login, so the token is invalid.');

          request.user = {
            id: decoded.payload.sub
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
          logger.error('There was an error verifying the token:', error);

          response.clearCookie('token', {
            httpOnly: true,
            domain: `.${new URL(config.frontendUrl).hostname}`
          });

          return response.sendError('Unauthorized', 401);
        }
      } else {
        next();
      }
    });

    const bodyParserOptions = {
      limit: '10mb',
      strict: true
    };

    this.server.use((request, response, next) => {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) return bodyParser.json(bodyParserOptions)(request, response, next);

      next();
    });

    logger.info('Middlewares added.');
  }
};