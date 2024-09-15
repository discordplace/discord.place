const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { router } = require('express-file-routing');
const path = require('path');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const ip = require('@/utils/middlewares/ip');
const blockSimultaneousRequests = require('@/utils/middlewares/blockSimultaneousRequests');
const compression = require('compression');
const morgan = require('morgan');

const passport = require('passport');
const User = require('@/schemas/User');
const UserHashes = require('@/schemas/User/Hashes');
const DiscordStrategy = require('passport-discord').Strategy;
const encrypt = require('@/utils/encryption/encrypt');

module.exports = class Server {
  constructor() {
    return this;
  }

  create() {
    this.server = express();

    this.server.set('trust proxy', config.trustProxy);
    this.server.disable('x-powered-by');
    this.server.disable('etag');

    logger.info('Server created.');
    return this;
  }

  async start(port = 8000) {
    this.addMiddlewares();
    this.configureSessions();
    this.createDiscordAuth();

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

    if (process.env.NODE_ENV === 'production' && config.globalRateLimit.enabled === true) this.server.use(require('@/utils/middlewares/globalRateLimiter'));
    
    this.server.use((request, response, next) => {
      if (config.customHostnames.includes(request.headers.host)) {
        const slashLength = request.url.split('/').filter(Boolean).length;
        if (slashLength > 1) return response.redirect(`${config.frontendUrl}/profiles`);
      }

      next();
    });

    if (process.env.NODE_ENV === 'production') this.server.use(blockSimultaneousRequests);
    
    logger.info('Middlewares added.');
  }

  configureSessions() {
    const store = MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      dbName: process.env.NODE_ENV === 'production' ? 'api' : 'development',
      touchAfter: 24 * 3600,
      crypto: {
        secret: process.env.SESSION_STORE_SECRET
      }
    });

    this.server.use(session({
      name: 'discordplace.sid',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        domain: process.env.NODE_ENV === 'production' ? new URL(config.frontendUrl).hostname : 'localhost',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    }));
  }

  createDiscordAuth() {
    const Strategy = new DiscordStrategy({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: '/auth/callback',
      scope: config.discordScopes
    }, (accessToken, refreshToken, profile, done) => process.nextTick(async () => {
      done(null, profile);
    }));

    Strategy.authorizationParams = () => ({ prompt: 'none' });

    passport.use(Strategy);

    this.server.use(passport.initialize());
    this.server.use(passport.session());

    passport.serializeUser(async (user, done) => {
      if (!user.email) throw new Error('User email not found.');

      done(null, user);

      User.findOneAndUpdate({ id: user.id },
        {
          id: user.id,
          data: {
            username: user.username,
            global_name: user.global_name
          },
          email: user.email,
          accessToken: encrypt(user.accessToken, process.env.USER_TOKEN_ENCRYPT_SECRET)
        }, 
        { upsert: true, new: true }
      ).catch(error => {
        logger.error('Error while saving user:', error);
        throw new Error('Error while logging in. Please try again.');
      });

      // Save avatar and banner to UserHashes
      await UserHashes.findOneAndUpdate(
        { id: user.id },
        {
          $set: {
            avatar: user.avatar,
            banner: user.banner
          }
        },
        { upsert: true }
      ).catch(() => null);
    });
    passport.deserializeUser((obj, done) => done(null, obj));

    global.passport = passport;

    this.server.use('*', (request, response, next) => {
      if (!request.user && request.session?.passport?.user) request.user = request.session.passport.user;
      next();
    });

    this.server.use('*', (request, response, next) => {
      if (request.user) {
        const guild = client.guilds.cache.get(config.guildId);
        if (guild) {
          const member = guild.members.cache.get(request.user.id);
          if (member) request.member = member;
        }
      }
      
      next();
    });
  }
};