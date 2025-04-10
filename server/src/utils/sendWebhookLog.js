const Discord = require('discord.js');

async function sendWebhookLog(action, fields, links) {
  const guild = client.guilds.cache.get(config.guildId);

  const logChannel = guild.channels.cache.get(config.webLogsChannelId);
  if (!logChannel) return;

  const actionNames = {
    'voteReceived': 'Vote Received',
    'guildListed': 'Guild Listed',
    'templateApplyRequest': 'Template Apply Request',
    'newLink': 'New Link',
    'linkDeleted': 'Link Deleted',
    'joinedGuild': 'Joined Guild',
    'leavedGuild': 'Left Guild',
    'quarantineCreated': 'Quarantine Created',
    'quarantineDeleted': 'Quarantine Deleted',
    'botRestored': 'Bot Restored',
    'webhookTested': 'Webhook Tested',
    'botDenyRecordDeleted': 'Deny Record Deleted',
    'botExtraOwnerRemoved': 'Extra Owner Removed',
    'botExtraOwnerAdded': 'Extra Owner Added',
    'reviewApproved': 'Review Approved',
    'reviewDenied': 'Review Denied',
    'reviewDeleted': 'Review Deleted',
    'reviewCreated': 'Review Created',
    'voteTimeoutDeleted': 'Vote Timeout Deleted',
    'botApproved': 'Bot Approved',
    'botDenied': 'Bot Denied',
    'botCreated': 'Bot Created',
    'botDeleted': 'Bot Deleted',
    'botUpdated': 'Bot Updated'
  };

  const embed = new Discord.EmbedBuilder()
    .setColor('#5865F2')
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() });

  fields.push({
    type: 'date',
    name: 'Date',
    value: Date.now()
  });

  async function fieldRenderer(field) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    switch (field.type) {
      case 'user':
        var user = await client.users.fetch(field.value).catch(() => null);

        return `- ${field.name} ⇾ **${user ? `@${Discord.escapeMarkdown(user.username)}` : 'Unknown User'}** \`${field.value}\``;
      case 'guild':
        var guild = typeof field.value === 'object' ? field.value : client.guilds.cache.get(field.value);

        return `- ${field.name} ⇾ **${guild ? Discord.escapeMarkdown(guild.name) : 'Unknown Guild'}** \`${field.value}\``;
      case 'date':
        var date = new Date(field.value);
        var unixDate = Math.floor(date.getTime() / 1000);

        return `- ${field.name} ⇾ ${Discord.time(unixDate, 'F')}`;
      case 'number':
        return `- ${field.name} ⇾ **${formatter.format(field.value)}**`;
      case 'text':
      default:
        return `- ${field.name} ⇾ **${field.value}**`;
    }
  }

  embed.setFields([
    {
      name: 'Event',
      value: actionNames[action] || action
    },
    {
      name: 'Details',
      value: (await Promise.all(fields.map(fieldRenderer))).join('\n')
    }
  ]);

  const components = [];

  if (links?.length > 0) {
    const row = new Discord.ActionRowBuilder()
      .addComponents(links
        .map(link => {
          return new Discord.ButtonBuilder()
            .setLabel(link.label)
            .setURL(link.url)
            .setStyle(Discord.ButtonStyle.Link);
        }));

    components.push(row);
  }

  return logChannel.send({
    embeds: [embed],
    components
  });
}

module.exports = sendWebhookLog;