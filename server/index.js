require('module-alias/register');

const { validateEnvironment } = require('@/utils/env');
validateEnvironment();

const config = require('@/utils/loadConfig')();
global.config = config;

const isDev = process.env.NODE_ENV === 'development';
const isProduction = (process.env.APP_ENV || process.env.NODE_ENV) === 'production';
const serverPort = Number(process.env.SERVER_PORT || process.env.PORT || 5001);

if (!Number.isInteger(serverPort) || serverPort < 1 || serverPort > 65_535) throw new Error('SERVER_PORT must be a valid port number.');

config.backendUrl = process.env.BACKEND_URL || (isDev ? `http://localhost:${serverPort}` : config.backendUrl);
config.frontendUrl = process.env.FRONTEND_URL || (isDev ? 'http://localhost:5000' : config.frontendUrl);

const Logger = require('@/utils/logger');
new Logger();

const Client = require('@/src/client.js');
const client = new Client();
client.create().start(process.env.DISCORD_CLIENT_TOKEN, {
  startup: {
    checkDeletedInviteCodes: true,
    checkDeletedRewardsRoles: true,
    updateClientActivity: true,
    checkVoteReminderMetadatas: true,
    checkReminerMetadatas: true,
    checkExpiredPremiums: true,
    updateBotStats: false,
    createNewDashboardData: false,
    syncMemberRoles: isProduction,
    syncLemonSqueezyPlans: isProduction,
    saveMonthlyVotes: false,
    saveDailyProfileStats: false,
    checkExpiredProducts: true,
    checkBucketAvailability: true,
    listenEvents: true,
    listenCrons: isProduction
  },
  registerCommands: false,
  unregisterCommands: false
});

const Server = require('@/src/server.js');
const server = new Server();
server.create().start(serverPort);

const connectDatabase = require('@/src/database/connect.js');
connectDatabase(process.env.MONGO_URL, {
  backup: isProduction
});

if (process.env.LEMON_SQUEEZY_API_KEY) {
  const { lemonSqueezySetup } = require('@lemonsqueezy/lemonsqueezy.js');

  lemonSqueezySetup({
    apiKey: process.env.LEMON_SQUEEZY_API_KEY,
    onError: error => logger.error('[Lemon Squeezy] Error:', error)
  });
}

process.on('unhandledRejection', error => logger.error(error));
process.on('uncaughtException', error => logger.error(error));

process.removeAllListeners('warning');
process.on('warning', warning => {
  if (
    warning.toString().includes('The `punycode` module is deprecated.') ||
    warning.toString().includes('ExperimentalWarning: buffer.File is an experimental feature and might change at any time')
  ) return;
  logger.warn(warning);
});

if (process.env.SENTRY_DSN) {
  const Sentry = require('@sentry/node');
  Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.APP_ENV || process.env.NODE_ENV });
}