// Modules
const Discord = require('discord.js');
const { CronJob } = require('cron');
const axios = require('axios');
const CloudflareAPI = require('cloudflare');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');

// Schemas
const Server = require('@/schemas/Server');
const VoiceActivity = require('@/schemas/Server/VoiceActivity');
const Panel = require('@/schemas/Server/Panel');
const MonthlyVotes = require('@/schemas/Server/MonthlyVotes');
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
const fetchGuildsMembers = require('@/utils/fetchGuildsMembers');

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
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates
      ],
      presence: {
        status: config.botPresenceStatus
      }
    });

    this.client.allMembersFetched = false;
    this.client.fetchedGuilds = new Discord.Collection();
    this.client.forceFetchedUsers = new Discord.Collection();
    this.client.blockedIps = new Discord.Collection();
    this.client.currentlyUploadingEmojiPack = new Discord.Collection();

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
      await fetchGuildsMembers([config.guildId]);

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
      if (options.startup.updatePanelMessages) this.updatePanelMessages();
      if (options.startup.updateClientActivity) this.updateClientActivity();
      if (options.startup.checkVoteReminderMetadatas) this.checkVoteReminderMetadatas();
      if (options.startup.checkReminerMetadatas) this.checkReminerMetadatas();
      if (options.startup.checkExpiredBlockedIPs) this.checkExpiredBlockedIPs();
      if (options.startup.updateBotStats) this.updateBotStats();
      if (options.startup.createNewDashboardData) this.createNewDashboardData();

      if (options.startup.listenCrons) {
        new CronJob('0 * * * *', () => {
          this.checkVoiceActivity();
          this.checkVoteReminderMetadatas();
          this.checkReminerMetadatas();
          this.checkExpiredBlockedIPs();
          this.checkDeletedInviteCodes();
          this.updateClientActivity();
        }, null, true, 'Europe/Istanbul');

        new CronJob('59 23 28-31 * *', this.saveMonthlyVotes, null, true, 'Europe/Istanbul');

        new CronJob('0 0 * * *', () => {
          this.checkVoteReminderMetadatas();
          this.updateBotStats();
          this.createNewDashboardData();
        }, null, true, 'Europe/Istanbul');

        new CronJob('*/5 * * * *', this.postNewMetric.bind(this), null, true, 'Europe/Istanbul');
      }
    });
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  async checkVoiceActivity() {
    const servers = await Server.find({ voice_activity_enabled: true });
    for (const server of servers) {
      const guild = client.guilds.cache.get(server.id);
      if (!guild) continue;

      const totalMembersInVoice = guild.members.cache.filter(member => member.voice.channel).size;
      const voiceActivity = await VoiceActivity.findOne({ 'guild.id': server.id });

      if (voiceActivity) {
        const data = voiceActivity.data;
        if (data.length === 24) data.shift();

        data.push({
          createdAt: new Date(),
          data: totalMembersInVoice
        });
        await voiceActivity.updateOne({ $set: { data: data } });
      } else await new VoiceActivity({
        guild: { id: server.id },
        data: [{
          createdAt: new Date(),
          data: totalMembersInVoice
        }]
      }).save();

      logger.info(`Voice activity for server ${server.id} updated.`);
    }
  }

  async updatePanelMessages() {
    const panels = await Panel.find();
    for (const panel of panels) await updatePanelMessage(panel.guildId);
  }

  async saveMonthlyVotes() {
    const servers = await Server.find();
    for (const server of servers) {
      const currentData = await MonthlyVotes.findOne({ guildId: server.id });
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const votes = server.votes;
       
      if (currentData) {
        const data = currentData.data;
        const monthData = data.find(data => data.month === month && data.year === year);
        if (monthData) {
          const index = data.indexOf(monthData);
          data[index].votes = votes;
          await currentData.updateOne({ $set: { data } });
        } else await currentData.updateOne({ $push: { data: { month, year, votes } } });
      } else await new MonthlyVotes({ guildId: server.id, data: [{ month, year, votes }] }).save();

      await updatePanelMessage(server.id);
    }
  }

  updateClientActivity() {
    const state = `Members: ${client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0).toLocaleString('en-US')} | Servers: ${client.guilds.cache.size.toLocaleString('en-US')}`;

    client.user.setActivity({
      type: Discord.ActivityType.Custom,
      name: 'status',
      state
    });
  }

  async checkVoteReminderMetadatas() {
    const reminders = await VoteReminder.find();
    VoteReminderMetadata.deleteMany({ documentId: { $nin: reminders.map(reminder => reminder.id) } })
      .then(deleted => logger.info(`Deleted ${deleted.deletedCount} vote reminder metadata.`))
      .catch(error => logger.error('Failed to delete vote reminder metadata:', error));
  }

  async checkReminerMetadatas() {
    const reminders = await Reminder.find();
    ReminderMetadata.deleteMany({ documentId: { $nin: reminders.map(reminder => reminder.id) } })
      .then(deleted => logger.info(`Deleted ${deleted.deletedCount} reminder metadata.`))
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

      logger.info(`Deleted ${deletedCount} expired blocked IPs.`);
    } catch (error) {
      logger.error('Failed to check expired blocked IPs collections:', error);
    }
  }

  async createNewDashboardData() {
    const totalServers = await Server.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const totalBots = await Bot.countDocuments();
    const totalEmojis = await Emoji.countDocuments();
    const totalTemplates = await Template.countDocuments();
    const emojiPacks = await EmojiPack.find();
    let totalEmojiPacks = 0;

    for (const pack of emojiPacks) totalEmojiPacks += pack.emoji_ids.length;
    
    await new DashboardData({
      servers: totalServers,
      profiles: totalProfiles,
      bots: totalBots,
      emojis: totalEmojis + totalEmojiPacks,
      templates: totalTemplates,
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
      logger.info(`Failed to get response time:\n${error.stack}`);
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
};