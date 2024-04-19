const fetchGuildsMembers = require('@/src/utils/fetchGuildsMembers');

module.exports = async guild => {
  logger.send(`Joined guild ${guild.name} (${guild.id}).`);

  fetchGuildsMembers([guild.id]);
};