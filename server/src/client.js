// Modules
const Discord = require('discord.js');
const { CronJob } = require('cron');
const axios = require('axios');
const CloudflareAPI = require('cloudflare');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');
const syncLemonSqueezyPlans = require('@/utils/payments/syncLemonSqueezyPlans');
const updateMonthlyVotes = require('@/utils/updateMonthlyVotes');
const updateClientActivity = require('@/utils/updateClientActivity');
const syncMemberRoles = require('@/utils/syncMemberRoles');

// Schemas
const Server = require('@/schemas/Server');
const Panel = require('@/schemas/Server/Panel');
const VoteReminderMetadata = require('@/schemas/Server/Vote/Metadata');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const ReminderMetadata = require('@/schemas/Reminder/Metadata');
const Reminder = require('@/schemas/Reminder');
const BlockedIp = require('@/schemas/BlockedIp');
const DashboardData = require('@/schemas/Dashboard/Data');
const Profile = require('@/schemas/Profile');
const Bot = require('@/schemas/Bot');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Template = require('@/schemas/Template');
const Sound = require('@/schemas/Sound');
const BotVoteTripledEnabled = require('@/schemas/Bot/Vote/TripleEnabled');
const ServerVoteTripledEnabled = require('@/schemas/Server/Vote/TripleEnabled');
const { StandedOutBot, StandedOutServer } = require('@/schemas/StandedOut');
const Reward = require('@/schemas/Server/Vote/Reward');

// Cloudflare Setup
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
const CLOUDFLARE_EMAIL = process.env.CLOUDFLARE_EMAIL;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_BLOCK_IP_LIST_ID = process.env.CLOUDFLARE_BLOCK_IP_LIST_ID;

const cloudflare = new CloudflareAPI({
  email: CLOUDFLARE_EMAIL,
  key: CLOUDFLARE_API_KEY
});

module.exports = class Client {
  constructor() {
    return this;
  }

  create() {
    this.client = new Discord.Client({
      intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildInvites
      ],
      presence: {
        status: config.botPresenceStatus
      }
    });

    this.client.blockedIps = new Discord.Collection();
    this.client.currentlyUploadingEmojiPack = new Discord.Collection();
    this.client.humanVerificationData = new Discord.Collection();
    this.client.humanVerificationTimeouts = new Discord.Collection();

    logger.info('Client created.');
    return this;
  }

  start(token, options = {}) {
    global.client = this.client;

    this.client.login(token).catch(error => {
      logger.error('Client failed to login:', error);
      process.exit(1);
    });

    this.client.once('ready', async () => {
      if (!client.guilds.cache.get(config.guildId)) {
        logger.error(`Guild with ID ${config.guildId} not found. You can change this guild ID in the config file.`);
        process.exit(1);
      }

      await client.guilds.cache.get(config.guildId).members.fetch();

      logger.info(`Client logged in as ${this.client.user.tag}`);

      const CommandsHandler = require('@/src/bot/handlers/commands.js');
      const commandsHandler = new CommandsHandler();
      commandsHandler.fetchCommands();
      
      if (options.registerCommands) {
        commandsHandler.registerCommands().then(() => process.exit(0)).catch(error => {
          logger.error('Failed to register commands:', error);
          process.exit(1);
        });
      }

      if (options.unregisterCommands) {
        commandsHandler.unregisterCommands().then(() => process.exit(0)).catch(error => {
          logger.error('Failed to unregister commands:', error);
          process.exit(1);
        });
      }

      client.commands = commandsHandler.commands;

      const EventsHandler = require('@/src/bot/handlers/events.js');
      const eventsHandler = new EventsHandler();
      if (options.startup.listenEvents) {
        eventsHandler.fetchEvents();
        eventsHandler.listenEvents();
      }

      if (options.startup.checkDeletedInviteCodes) this.checkDeletedInviteCodes();
      if (options.startup.checkDeletedRewardsRoles) this.checkDeletedRewardsRoles();
      if (options.startup.updatePanelMessages) this.updatePanelMessages();
      if (options.startup.updateClientActivity) updateClientActivity();
      if (options.startup.checkVoteReminderMetadatas) this.checkVoteReminderMetadatas();
      if (options.startup.checkReminerMetadatas) this.checkReminerMetadatas();
      if (options.startup.checkExpiredBlockedIPs) this.checkExpiredBlockedIPs();
      if (options.startup.updateBotStats) this.updateBotStats();
      if (options.startup.createNewDashboardData) this.createNewDashboardData();
      if (options.startup.syncMemberRoles) syncMemberRoles();
      if (options.startup.syncLemonSqueezyPlans) this.syncLemonSqueezyPlans();
      if (options.startup.saveMonthlyVotes) this.saveMonthlyVotes();
      if (options.startup.saveDailyProfileStats) this.saveDailyProfileStats();
      if (options.startup.checkExpiredProducts) this.checkExpiredProducts();

      if (options.startup.listenCrons) {
        new CronJob('0 * * * *', () => {
          this.checkVoteReminderMetadatas();
          this.checkReminerMetadatas();
          this.checkExpiredBlockedIPs();
          this.checkDeletedInviteCodes();
          this.checkDeletedRewardsRoles();
          updateClientActivity();
          syncMemberRoles();
          this.syncLemonSqueezyPlans();
        }, null, true);
        
        new CronJob('59 23 * * *', () => {
          const today = new Date();
          const nextDay = new Date(today);
          nextDay.setDate(today.getDate() + 1);
          
          if (nextDay.getDate() === 1) {
            logger.info('Reached the end of the month. Saving monthly votes.');
            
            this.saveMonthlyVotes();
          }
        }, null, true);

        new CronJob('0 0 * * *', () => {
          this.checkVoteReminderMetadatas();
          this.updateBotStats();
          this.createNewDashboardData();
          this.saveDailyProfileStats();
        }, null, true);

        new CronJob('*/5 * * * *', this.postNewMetric.bind(this), null, true);
      }
    });
  }

  async checkDeletedInviteCodes() {
    const servers = await Server.find({ 'invite_code.type': 'Invite' });
    for (const server of servers) {
      const guild = client.guilds.cache.get(server.id);
      if (!guild) continue;

      const invite = await guild.invites.fetch().catch(() => null);
      if (!invite || !invite.find(invite => invite.code === server.invite_code.code)) {
        await server.updateOne({ $set: { invite_code: { type: 'Deleted' } } });

        logger.info(`Invite code ${server.invite_code.code} for server ${server.id} was deleted.`);
      }
    }
  }

  async checkDeletedRewardsRoles() {
    const rewards = await Reward.find();
  
    const serversToCheck = new Set(rewards.map(reward => reward.guild.id));
      
    const deleteServerOperations = [];
    const deleteRoleOperations = [];
  
    for (const serverId of serversToCheck) {
      const guild = client.guilds.cache.get(serverId);
      if (!guild) deleteServerOperations.push({
        deleteMany: {
          filter: { 'guild.id': serverId }
        }
      });
    }
  
    for (const reward of rewards) {
      const guild = client.guilds.cache.get(reward.guild.id);
      if (guild) {
        const role = guild.roles.cache.get(reward.role.id);
        if (!role) deleteRoleOperations.push({
          deleteOne: {
            filter: { 'role.id': reward.role.id }
          }
        });
      }
    }
  
    if (deleteServerOperations.length > 0) await Reward.bulkWrite(deleteServerOperations);
    if (deleteRoleOperations.length > 0) await Reward.bulkWrite(deleteRoleOperations);
  
    if (deleteServerOperations.length > 0 || deleteRoleOperations.length > 0) {
      logger.info(`Deleted vote rewards that associated with deleted servers or roles. (Operations: ${deleteServerOperations.length + deleteRoleOperations.length})`);
    }
  }
  
  async updatePanelMessages() {
    const panels = await Panel.find();
    for (const panel of panels) await updatePanelMessage(panel.guildId);
  }

  async saveMonthlyVotes() {
    try {
      await updateMonthlyVotes();
    
      logger.info('Monthly votes saved.');
    } catch (error) {
      logger.error('Failed to save monthly votes:', error);
    }
  }

  async checkVoteReminderMetadatas() {
    const reminders = await VoteReminder.find();
    VoteReminderMetadata.deleteMany({ documentId: { $nin: reminders.map(reminder => reminder.id) } })
      .then(deleted => {
        if (deleted.deletedCount <= 0) return;

        logger.info(`Deleted ${deleted.deletedCount} vote reminder metadata.`);
      })
      .catch(error => logger.error('Failed to delete vote reminder metadata:', error));
  }

  async checkReminerMetadatas() {
    const reminders = await Reminder.find();
    ReminderMetadata.deleteMany({ documentId: { $nin: reminders.map(reminder => reminder.id) } })
      .then(deleted => {
        if (deleted.deletedCount <= 0) return;

        logger.info(`Deleted ${deleted.deletedCount} reminder metadata.`);
      })
      .catch(error => logger.error('Failed to delete reminder metadata:', error));
  }

  async updateBotStats() {
    if (!process.env.DISCORD_PLACE_API_KEY) return logger.warn('API key is not defined. Please define DISCORD_PLACE_API_KEY in your environment variables.');

    const url = `https://api.discord.place/bots/${client.user.id}/stats`;
    const data = {
      command_count: client.commands.size
    };
    
    try {
      const response = await axios.patch(url, data, {
        headers: {
          authorization: process.env.DISCORD_PLACE_API_KEY
        }
      });

      if (response.status === 200) logger.info('Bot stats updated on Discord Place.');
      else logger.error(`Failed to update bot stats: ${response.data}`);
    } catch (error) {
      logger.error('Failed to update bot stats:', error);
    }
  }

  async checkExpiredBlockedIPs() {
    try {
      const blockedIps = await BlockedIp.find();
      const response = await cloudflare.rules.lists.items.list(CLOUDFLARE_BLOCK_IP_LIST_ID, {
        account_id: CLOUDFLARE_ACCOUNT_ID
      });

      let deletedCount = 0;

      for (const { ip } of blockedIps) {
        const item = response.result.find(item => item?.ip === ip);
        if (!item) {
          await BlockedIp.deleteOne({ _id: ip });
          deletedCount++;
        }
      }

      if (deletedCount <= 0) return;

      logger.info(`Deleted ${deletedCount} expired blocked IPs.`);
    } catch (error) {
      logger.error('Failed to check expired blocked IPs collections:', error);
    }
  }

  async createNewDashboardData() {
    const emojiPacks = await EmojiPack.find();

    const totalServers = await Server.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const totalBots = await Bot.countDocuments();
    const totalEmojis = (await Emoji.countDocuments()) + emojiPacks.reduce((acc, pack) => acc + pack.emoji_ids.length, 0);
    const totalTemplates = await Template.countDocuments();
    const totalSounds = await Sound.countDocuments();

    await new DashboardData({
      servers: totalServers,
      profiles: totalProfiles,
      bots: totalBots,
      emojis: totalEmojis,
      templates: totalTemplates,
      sounds: totalSounds,
      users: client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0),
      guilds: client.guilds.cache.size
    }).save();

    logger.info('Created new dashboard data.');
  }

  async getResponseTime() {
    const baseUrl = config.backendUrl;

    try {
      await axios.post(`${baseUrl}/response-time`);

      const response = await axios.get(`${baseUrl}/response-time`);

      return response.data.responseTime;
    } catch (error) {
      logger.info(`Failed to get response time:\n${error}`);
    }
  }
      
  async postNewMetric() {
    if (!config.instatus.page_id || !config.instatus.metric_id) return logger.warn('[Instatus] Page ID or Metric ID is not defined.');
    if (!process.env.DISCORD_PLACE_INSTATUS_API_KEY) return logger.warn('[Instatus] API key is not defined. Please define DISCORD_PLACE_INSTATUS_API_KEY in your environment variables.');

    const baseUrl = 'https://api.instatus.com';
    const responseTime = await this.getResponseTime();

    try {
      const response = await axios.post(`${baseUrl}/v1/${config.instatus.page_id}/metrics/${config.instatus.metric_id}`, {
        timestamp: new Date().getTime(),
        value: responseTime
      }, {
        headers: {
          Authorization: `Bearer ${process.env.DISCORD_PLACE_INSTATUS_API_KEY}`
        }
      });

      if (response.status === 200) logger.info('Posted new metric to Instatus.');
    } catch (error) {
      logger.error('Failed to post new metric to Instatus:', error);
    }
  }

  async syncLemonSqueezyPlans() {
    if (!process.env.LEMON_SQUEEZY_API_KEY) return logger.warn('[Lemon Squeezy] API key is not defined. Please define LEMON_SQUEEZY_API_KEY in your environment variables.');

    return syncLemonSqueezyPlans()
      .catch(error => logger.error('There was an error while syncing Lemon Squeezy plans:', error));
  }

  async saveDailyProfileStats() {
    const updatedProfiles = await Profile.updateMany({}, [
      {
        $set: {
          dailyStats: {
            $let: {
              vars: {
                updatedDailyStats: {
                  $concatArrays: [
                    {
                      $ifNull: ['$dailyStats', []] // If dailyLikes doesn't exist, use an empty array
                    },
                    [
                      {
                        likes: '$likes_count',
                        views: '$views',
                        createdAt: new Date()
                      }
                    ]
                  ]
                }
              },
              in: {
                $slice: ['$$updatedDailyStats', -7] // Keep only the last 7 elements
              }
            }
          }
        }
      }
    ]);

    logger.info(`Saved daily stats for ${updatedProfiles.modifiedCount} profiles.`);
  }

  async checkExpiredProducts() {
    const expiredBotTripledVotes = await deleteExpiredProducts(BotVoteTripledEnabled, 86400000);
    const expiredServerTripledVotes = await deleteExpiredProducts(ServerVoteTripledEnabled, 86400000);
    const expiredStandedOutBots = await deleteExpiredProducts(StandedOutBot, 43200000);
    const expiredStandedOutServers = await deleteExpiredProducts(StandedOutServer, 43200000);
    
    function deleteExpiredProducts(Model, expireTime) {
      return Model.deleteMany({ createdAt: { $lt: new Date(Date.now() - expireTime) } });
    }

    if (expiredBotTripledVotes.deletedCount > 0) logger.info(`Deleted ${expiredBotTripledVotes.deletedCount} expired bot tripled votes.`);
    if (expiredServerTripledVotes.deletedCount > 0) logger.info(`Deleted ${expiredServerTripledVotes.deletedCount} expired server tripled votes.`);
    if (expiredStandedOutBots.deletedCount > 0) logger.info(`Deleted ${expiredStandedOutBots.deletedCount} expired standed out bots.`);
    if (expiredStandedOutServers.deletedCount > 0) logger.info(`Deleted ${expiredStandedOutServers.deletedCount} expired standed out servers.`);
  }
};