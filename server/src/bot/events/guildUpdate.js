const fetchGuildsMembers = require('@/utils/fetchGuildsMembers');

module.exports = async (oldGuild, newGuild) => {
  if (!oldGuild.available && newGuild.available) {
    logger.info(`Guild ${newGuild.name} (${newGuild.id}) became available.`);

    fetchGuildsMembers([newGuild.id]);
  }
};