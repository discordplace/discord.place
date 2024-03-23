require('module-alias/register');

if (process.argv.includes('--production')) process.env.NODE_ENV = 'production';
else process.env.NODE_ENV = 'development';

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
    fetchAllGuildMembers: true,
    checkDeletedInviteCodes: true,
    updatePanelMessages: true,
    updateClientActivity: true,
    checkVoteReminderMetadatas: true,
    listenEvents: true
  },
  registerCommands: false,
  unregisterCommands: false,
});

const Server = require('@/src/server.js');
const server = new Server();
server.create().start(config.port.backend);

const connectDatabase = require('@/src/database/connect.js');
connectDatabase(process.env.MONGO_URL);

process.on('unhandledRejection', (error) => logger.send(error.stack));
process.on('uncaughtException', (error) => logger.send(error.stack));