const fetchGuildsMembers = require('@/utils/fetchGuildsMembers');

module.exports = async (oldGuild, newGuild) => {
  if (!oldGuild.available && newGuild.available) {
    logger.send(`Guild ${newGuild.name} (${newGuild.id}) became available.`);

    fetchGuildsMembers([newGuild.id]);
  }
};