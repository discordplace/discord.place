const Discord = require('discord.js');
const Server = require('@/schemas/Server');
const VoiceActivity = require('@/schemas/Server/VoiceActivity');
const { CronJob } = require('cron');
const Panel = require('@/schemas/Server/Panel');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');
const MonthlyVotes = require('@/schemas/Server/MonthlyVotes');
const VoteReminderMetadata = require('@/schemas/Server/Vote/Metadata');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const ReminderMetadata = require('@/schemas/Reminder/Metadata');
const Reminder = require('@/schemas/Reminder');
const axios = require('axios');

module.exports = class Client {
  constructor() {
    return this;
  }

  create() {
    this.client = new Discord.Client({
      intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
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

    logger.send('Client created.');
    return this;
  }

  start(token, options = {}) {
    global.client = this.client;

    this.client.login(token).catch(error => {
      logger.send(`Client failed to login: ${error}`);
      process.exit(1);
    });

    this.client.once('ready', () => {
      logger.send(`Client logged in as ${this.client.user.tag}`);

      const CommandsHandler = require('@/src/bot/handlers/commands.js');
      const commandsHandler = new CommandsHandler();
      commandsHandler.fetchCommands();
      if (options.registerCommands) {
        commandsHandler.registerCommands().then(() => process.exit(0)).catch(error => {
          logger.send(`Failed to register commands: ${error}`);
          process.exit(1);
        });
      }
      if (options.unregisterCommands) {
        commandsHandler.unregisterCommands().then(() => process.exit(0)).catch(error => {
          logger.send(`Failed to unregister commands: ${error}`);
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
      if (options.startup.updateBotStats) this.updateBotStats();

      if (options.startup.listenCrons) {
        new CronJob('0 * * * *', this.checkVoiceActivity, null, true, 'Europe/Istanbul');
        new CronJob('59 23 28-31 * *', this.saveMonthlyVotes, null, true, 'Europe/Istanbul');
        new CronJob('0 0 * * *', () => {
          this.checkReminerMetadatas();
          this.updateBotStats();
        }, null, true, 'Europe/Istanbul');
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
        logger.send(`Invite code ${server.invite_code.code} for server ${server.id} was deleted.`);
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

      logger.send(`Voice activity for server ${server.id} updated.`);
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
    client.user.setActivity({
      type: Discord.ActivityType.Custom,
      name: 'status',
      state: `Members: ${client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0).toLocaleString('en-US')} | Servers: ${client.guilds.cache.size.toLocaleString('en-US')}`
    });
  }

  async checkVoteReminderMetadatas() {
    const reminders = await VoteReminder.find();
    VoteReminderMetadata.deleteMany({ documentId: { $nin: reminders.map(reminder => reminder.id) } })
      .then(deleted => logger.send(`Deleted ${deleted.deletedCount} vote reminder metadata.`))
      .catch(error => logger.send(`Failed to delete vote reminder metadata:\n${error.stack}`));
  }

  async checkReminerMetadatas() {
    const reminders = await Reminder.find();
    ReminderMetadata.deleteMany({ documentId: { $nin: reminders.map(reminder => reminder.id) } })
      .then(deleted => logger.send(`Deleted ${deleted.deletedCount} reminder metadata.`))
      .catch(error => logger.send(`Failed to delete reminder metadata:\n${error.stack}`));
  }

  async updateBotStats() {
    const url = `https://api.discord.place/bots/${client.user.id}/stats`;
    const data = {
      server_count: client.guilds.cache.size,
      command_count: client.commands.size
    };
    
    try {
      const response = await axios.patch(url, data, {
        headers: {
          authorization: process.env.DISCORD_PLACE_API_KEY
        }
      });

      if (response.status === 200) logger.send('Bot stats updated on Discord Place.');
      else logger.send(`Failed to update bot stats: ${response.data}`);
    } catch (error) {
      logger.send(`Failed to update bot stats:\n${error.stack}`);
    }
  }
};