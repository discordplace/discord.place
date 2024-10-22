const Discord = require('discord.js');

const now = Date.now();
const twoWeeksInMs = 1209600000;

const requirementChecks = {
  enough_members: guild => guild.memberCount >= 100,
  old_enough: guild => now - guild.createdAt >= twoWeeksInMs,
  has_icon: guild => guild.icon !== null,
  '2fa_enabled': guild => guild.mfaLevel === 1,
  is_community: guild => guild.features.includes(Discord.GuildFeature.Community),
  no_nsfw: guild => !guild.channels.cache.some(channel => channel.nsfw === true)
};

module.exports = requirementChecks;