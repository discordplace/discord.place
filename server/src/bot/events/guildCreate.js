const fetchGuildsMembers = require('@/src/utils/fetchGuildsMembers');

module.exports = async guild => {
  logger.info(`Joined guild ${guild.name} (${guild.id}).`);

  fetchGuildsMembers([guild.id]);
};