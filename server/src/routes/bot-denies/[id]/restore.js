const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const BotDeny = require('@/schemas/Bot/Deny');
const Bot = require('@/schemas/Bot');
const { param } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const Discord = require('discord.js');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id'),
    async (request, response) => {
      const canRestore = request.member && config.permissions.canRestoreBotDeniesRoles.some(role => request.member.roles.cache.has(role));
      if (!canRestore) return response.sendError('You do not have permission to restore bot denies.', 403);

      const { id } = request.matchedData

      const botDenyData = await BotDeny.findOne({ 'bot.id': id });
      if (!botDenyData) return response.sendError('Bot deny record not found.', 404);

      const botUser = await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found.', 404);

      const botAlreadyExists = await Bot.findOne({ id });
      if (botAlreadyExists) return response.sendError('You can\'t restore a bot that already exists.', 400);

      const bot = new Bot(botDenyData.data);

      await bot.save();

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = guild.members.cache.get(bot.owner.id) || await guild.members.fetch(bot.owner.id).catch(() => null);
      if (publisher) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### We denied your bot **${botUser.username}** but the decision has been reverted by <@${request.user.id}>.\nYour bot is now back in the review queue.` }).catch(() => null);
      }

      const embeds = [
        new Discord.EmbedBuilder()
          .setTitle('Bot Deny Restored')
          .setAuthor({ name: publisher.username, iconURL: publisher.displayAvatarURL() })
          .setFields([
            {
              name: 'Bot Restored',
              value: `@${botUser.username} (${botUser.id})`
            },
            {
              name: 'Restored By',
              value: `@${request.member.user.username} (${request.user.id})`
            }
          ])
          .setTimestamp()
          .setColor(Discord.Colors.Purple)
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(`${config.frontendUrl}/bots/${id}`)
              .setLabel('View Bot on discord.place')
          )
      ];

      client.channels.cache.get(config.botDenyRestoreLogsChannelId).send({ embeds, components });

      return response.status(204).end();
    }
  ]
};