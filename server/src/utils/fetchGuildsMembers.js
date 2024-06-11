async function fetchGuildsMembers(guildIdsToFetch) {
  logger.info(`New request to fetch members for guild(s) ${guildIdsToFetch.join(', ')}`);

  try {
    const guildFetchPromises = guildIdsToFetch.map(async (id) => {
      const guild = client.guilds.cache.get(id);
      if (!guild) throw new Error(`Guild with ID ${id} not found`);

      logger.info(`Fetching members for guild ${guild.name} (${guild.id})`);

      if (client.fetchedGuilds.has(guild.id)) {
        logger.info(`Members for guild ${guild.name} (${guild.id}) already fetched, skipped.`);
        return;
      }

      const members = await guild.members.fetch();
      client.fetchedGuilds.set(guild.id, true);
      logger.info(`Fetched members for guild ${guild.name} (${guild.id}) with ${members.size} members`);
    });

    await Promise.all(guildFetchPromises);

    logger.info(`Finished fetching members for guild(s) ${guildIdsToFetch.join(', ')}`);
  } catch (error) {
    logger.error('Error fetching members:', error);
    throw error;
  }
}

module.exports = fetchGuildsMembers;
