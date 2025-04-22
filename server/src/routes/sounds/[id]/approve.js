const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Sound = require('@/schemas/Sound');
const Discord = require('discord.js');
const DashboardData = require('@/schemas/Dashboard/Data');
const idValidation = require('@/validations/sounds/id');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const canApprove = request.member && config.permissions.canApproveSoundsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canApprove) return response.sendError('You are not allowed to approve this sound.', 403);

      const sound = await Sound.findOne({ id });
      if (!sound) return response.sendError('Sound not found.', 404);

      if (sound.approved === true) return response.sendError('Sound is already approved.', 400);

      await sound.updateOne({ approved: true });

      await DashboardData.findOneAndUpdate({}, { $inc: { sounds: 1 } }, { sort: { createdAt: -1 } });

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = await client.users.fetch(sound.publisher.id).catch(() => null);
      const isPublisherFoundInGuild = guild.members.cache.has(publisher.id) || await guild.members.fetch(publisher.id).then(() => true).catch(() => false);

      if (isPublisherFoundInGuild) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Congratulations!\nYour sound **${sound.name}** (ID: ${sound.id}) has been approved by <@${request.user.id}>.` }).catch(() => null);
      }

      const embeds = [
        new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Green)
          .setAuthor({ name: `Sound Approved | ${sound.name}`, iconURL: publisher?.displayAvatarURL?.() || 'https://cdn.discordapp.com/embed/avatars/0.png' })
          .setTimestamp()
          .setFields([
            {
              name: 'Reviewer',
              value: `<@${request.user.id}>`
            }
          ])
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(`${config.frontendUrl}/sounds/${id}`)
              .setLabel('View Sound on discord.place')
          )
      ];

      client.channels.cache.get(config.portalChannelId).send({ embeds, components });

      sendLog(
        'soundApproved',
        [
          { type: 'user', name: 'Moderator', value: request.user.id },
          { type: 'text', name: 'Sound', value: `${sound.name} (${sound.id})` }
        ],
        [
          { label: 'View Moderator', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'View Sound', url: `${config.frontendUrl}/sounds/${sound.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};