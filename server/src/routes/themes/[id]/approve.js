const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Theme = require('@/schemas/Theme');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const DashboardData = require('@/schemas/Dashboard/Data');
const idValidation = require('@/validations/themes/id');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const canApprove = request.member && config.permissions.canApproveThemesRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canApprove) return response.sendError('You are not allowed to approve this theme.', 403);

      const theme = await Theme.findOne({ id });
      if (!theme) return response.sendError('Theme not found.', 404);

      if (theme.approved === true) return response.sendError('Theme is already approved.', 400);

      await theme.updateOne({ approved: true });

      await DashboardData.findOneAndUpdate({}, { $inc: { sounds: 1 } }, { sort: { createdAt: -1 } });

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = await client.users.fetch(theme.publisher.id).catch(() => null);
      const isPublisherFoundInGuild = guild.members.cache.has(publisher.id) || await guild.members.fetch(publisher.id).then(() => true).catch(() => false);

      if (isPublisherFoundInGuild) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Congratulations!\nYour theme (Colors: ${theme.colors.primary} - ${theme.colors.secondary} | ID: ${theme.id}) has been approved by <@${request.user.id}>.` }).catch(() => null);
      }

      const embeds = [
        new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Green)
          .setAuthor({ name: 'Theme Approved', iconURL: publisher?.displayAvatarURL?.() || '/default-discord-avatar.png' })
          .setTimestamp()
          .setFields([
            {
              name: 'Reviewer',
              value: `<@${request.user.id}>`
            }
          ]),
        new Discord.EmbedBuilder()
          .setColor(theme.colors.primary)
          .setFooter({ text: 'Primary Color' }),
        new Discord.EmbedBuilder()
          .setColor(theme.colors.secondary)
          .setFooter({ text: 'Secondary Color' })
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(`${config.frontendUrl}/themes/${id}`)
              .setLabel('View Theme on discord.place')
          )
      ];

      client.channels.cache.get(config.portalChannelId).send({ embeds, components });

      return response.status(204).end();
    }
  ]
};