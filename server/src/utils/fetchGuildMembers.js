const sleep = require('@/utils/sleep');

async function fetchGuildMembers(guild = client.guilds.cache.get(config.guildId)) {
  if (!guild) {
    logger.error(`Guild with ID ${config.guildId} not found. Cannot fetch members.`);

    return null;
  }

  try {
    return await guild.members.fetch();
  } catch (error) {
    const retryAfter = error?.retryAfter ?? error?.data?.retry_after;

    if (typeof retryAfter !== 'number') {
      logger.warn(`Failed to fetch members of guild ${guild.id}: ${error?.message || error}`);

      return null;
    }

    logger.warn(`Member list request was rate limited. Retrying in ${Math.ceil(retryAfter)} seconds.`);

    await sleep(Math.ceil(retryAfter * 1000) + 1000);

    return guild.members.fetch().catch(retryError => {
      logger.warn(`Failed to fetch members of guild ${guild.id} after retry: ${retryError?.message || retryError}`);

      return null;
    });
  }
}

module.exports = fetchGuildMembers;
