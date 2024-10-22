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
    updateClientActivity: false,
    checkVoteReminderMetadatas: false,
    checkReminerMetadatas: false,
    checkExpiredBlockedIPs: false,
    checkExpiredPremiums: false,
    updateBotStats: false,
    createNewDashboardData: false,
    syncMemberRoles: false,
    syncLemonSqueezyPlans: process.env.NODE_ENV === 'production',
    saveMonthlyVotes: false,
    saveDailyProfileStats: false,
    checkExpiredProducts: false,
    checkBucketAvailability: false,
    listenEvents: false,
    listenCrons: false
  },
  registerCommands: true,
  unregisterCommands: false
});

const connectDatabase = require('@/src/database/connect.js');
connectDatabase(process.env.MONGO_URL, { backup: false });