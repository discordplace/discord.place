const Discord = require('discord.js');

const now = Date.now();
const twoWeeksInMs = 1209600000;

const requirementChecks = {
  '2fa_enabled': guild => guild.mfaLevel === 1,
  enough_members: guild => guild.memberCount >= 100,
  has_icon: guild => guild.icon !== null,
  is_community: guild => guild.features.includes(Discord.GuildFeature.Community),
  no_nsfw: guild => !guild.channels.cache.some(channel => channel.nsfw === true),
  old_enough: guild => now - guild.createdAt >= twoWeeksInMs
};

module.exports = requirementChecks;