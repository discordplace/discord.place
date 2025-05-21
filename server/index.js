require('module-alias/register');

const environmentCheck = require('@/utils/environmentCheck.js');
environmentCheck();

const fs = require('node:fs');
const config = require('js-yaml').load(fs.readFileSync('./config.yml', 'utf8'));
global.config = config;

if (process.env.NODE_ENV === 'development') {
  config.backendUrl = `http://localhost:${config.port.backend}`;
  config.frontendUrl = `http://localhost:${config.port.frontend}`;
}

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
    syncMemberRoles: process.env.NODE_ENV === 'production',
    syncLemonSqueezyPlans: process.env.NODE_ENV === 'production',
    saveMonthlyVotes: false,
    saveDailyProfileStats: false,
    checkExpiredProducts: true,
    checkBucketAvailability: true,
    listenEvents: true,
    listenCrons: process.env.NODE_ENV === 'production'
  },
  registerCommands: false,
  unregisterCommands: false
});

const Server = require('@/src/server.js');
const server = new Server();
server.create().start(config.port.backend);

const connectDatabase = require('@/src/database/connect.js');
connectDatabase(process.env.MONGO_URL, {
  backup: process.env.NODE_ENV === 'production'
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
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}