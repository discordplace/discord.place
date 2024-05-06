require('module-alias/register');

const fs = require('node:fs');
const config = require('js-yaml').load(fs.readFileSync('./config.yml', 'utf8'));
global.config = config;

const Logger = require('@/utils/logger');
new Logger();

const Client = require('@/src/client.js');
const client = new Client();
client.create().start(process.env.DISCORD_CLIENT_TOKEN, {
  startup: {
    checkDeletedInviteCodes: false,
    updatePanelMessages: false,
    updateClientActivity: false,
    checkVoteReminderMetadatas: false,
    checkReminerMetadatas: false,
    checkQuittedBots: false,
    updateBotStats: true,
    listenEvents: false,
    listenCrons: false
  },
  registerCommands: true,
  unregisterCommands: false
});