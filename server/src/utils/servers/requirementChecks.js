const Discord = require('discord.js');

const now = Date.now();
const twoWeeksInMs = 1209600000;

const requirementChecks = {
  enough_members: guild => ({ success: guild.memberCount >= 100 }),
  old_enough: guild => ({ success: now - guild.createdAt >= twoWeeksInMs }),
  has_icon: guild => ({ success: guild.icon !== null }),
  '2fa_enabled': guild => ({ success: guild.mfaLevel === 1 }),
  is_community: guild => ({ success: guild.features.includes(Discord.GuildFeature.Community) }),
  no_nsfw: guild => ({
    success: !guild.channels.cache.every(channel => channel.nsfw === false),
    channels: guild.channels.cache.filter(channel => channel.nsfw === true).map(channel => ({ id: channel.id, name: channel.name }))
  })
};

module.exports = requirementChecks;