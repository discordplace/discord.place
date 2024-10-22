require('module-alias/register');

const fs = require('node:fs');
const config = require('js-yaml').load(fs.readFileSync('./config.yml', 'utf8'));
global.config = config;

const Logger = require('@/utils/logger');
new Logger();

const Client = require('@/src/client.js');
const client = new Client();
client.create().start(process.env.DISCORD_CLIENT_TOKEN, {
  registerCommands: false,
  startup: {
    checkBucketAvailability: false,
    checkDeletedInviteCodes: false,
    checkExpiredBlockedIPs: false,
    checkExpiredPremiums: false,
    checkExpiredProducts: false,
    checkReminerMetadatas: false,
    checkVoteReminderMetadatas: false,
    createNewDashboardData: false,
    listenCrons: false,
    listenEvents: false,
    saveDailyProfileStats: false,
    saveMonthlyVotes: false,
    syncLemonSqueezyPlans: process.env.NODE_ENV === 'production',
    syncMemberRoles: false,
    updateBotStats: false,
    updateClientActivity: false
  },
  unregisterCommands: true
});

const connectDatabase = require('@/src/database/connect.js');
connectDatabase(process.env.MONGO_URL, { backup: false });