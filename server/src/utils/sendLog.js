const Discord = require('discord.js');
const getIpDetails = require('@/utils/getIpDetails');

async function sendLog(action, fields, links) {
  const guild = client.guilds.cache.get(config.guildId);

  const logChannel = guild.channels.cache.get(config.webLogsChannelId);
  if (!logChannel) return;

  const actionNames = {
    'voteReceived': 'Vote Received',
    'guildListed': 'Guild Listed',
    'guildDeleted': 'Guild Deleted',
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
    'botUpdated': 'Bot Updated',
    'botStatsUpdated': 'Bot Stats Updated',
    'emojiApproved': 'Emoji Approved',
    'emojiPackApproved': 'Emoji Pack Approved',
    'emojiDeleted': 'Emoji Deleted',
    'emojiPackDeleted': 'Emoji Pack Deleted',
    'emojiDenied': 'Emoji Denied',
    'emojiPackDenied': 'Emoji Pack Denied',
    'emojiUploadedToGuild': 'Emoji Uploaded to Guild',
    'emojiPackUploadedToGuild': 'Emoji Pack Uploaded to Guild',
    'emojiCreated': 'Emoji Created',
    'emojiPackCreated': 'Emoji Pack Created',
    'checkoutCreated': 'Checkout Created',
    'orderRefunded': 'Order Refunded',
    'subscriptionExpired': 'Subscription Expired',
    'profileSocialLinkDeleted': 'Profile Social Link Deleted',
    'profileDeleted': 'Profile Deleted',
    'profileUpdated': 'Profile Updated',
    'profileLiked': 'Profile Liked',
    'profileUnliked': 'Profile Unliked',
    'profileCreated': 'Profile Created',
    'serverUpdated': 'Server Updated',
    'voteReminderCreated': 'Vote Reminder Created',
    'soundApproved': 'Sound Approved',
    'soundDenied': 'Sound Denied',
    'soundDeleted': 'Sound Deleted',
    'soundLiked': 'Sound Liked',
    'soundUnliked': 'Sound Unliked',
    'soundUploadedToGuild': 'Sound Uploaded to Guild',
    'soundCreated': 'Sound Created',
    'templateApproved': 'Template Approved',
    'templateDenied': 'Template Denied',
    'templateDeleted': 'Template Deleted',
    'templateCreated': 'Template Created',
    'themeApproved': 'Theme Approved',
    'themeDenied': 'Theme Denied',
    'themeDeleted': 'Theme Deleted',
    'themeCreated': 'Theme Created',
    'newReportCreated': 'New Report Created',
    'userLogin': 'User Login',
    'userLogout': 'User Logout'
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

        return `- ${field.name} ⇾ ${Discord.time(unixDate, 'D')} \`${new Date(field.value).toLocaleTimeString()}\``;
      case 'number':
        return `- ${field.name} ⇾ **${formatter.format(field.value)}**`;
      case 'request':
        var requestBump = {
          ip: field.value.clientIp,
          userAgent: field.value.headers['user-agent']
        };

        if (process.env.NODE_ENV === 'development') {
          const ipDetails = await getIpDetails(field.value.clientIp).catch(() => null);
          if (ipDetails) requestBump.ip = ipDetails;
        }

        return `- ${field.name}\n\`\`\`json\n${JSON.stringify(requestBump, null, 2)}\n\`\`\``;
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

module.exports = sendLog;