require('module-alias/register');

if (process.argv.includes('--production')) process.env.NODE_ENV = 'production';
else process.env.NODE_ENV = 'development';

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
    updatePanelMessages: true,
    updateClientActivity: true,
    checkVoteReminderMetadatas: true,
    checkReminerMetadatas: true,
    checkExpiredBlockedIPs: true,
    updateBotStats: false,
    createNewDashboardData: false,
    syncPremiumRoles: process.env.NODE_ENV === 'production',
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

process.on('unhandledRejection', error => logger.error(error));
process.on('uncaughtException', error => logger.error(error));

process.removeAllListeners('warning');
process.on('warning', warning => {
  if (warning.toString().includes('The `punycode` module is deprecated.')) return;
  logger.warn(warning);
});