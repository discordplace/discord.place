async function fetchGuildsMembers(guildIdsToFetch) {
  logger.send(`New request to fetch members for guild(s) ${guildIdsToFetch.join(', ')}`);

  try {
    const guildFetchPromises = guildIdsToFetch.map(async (id) => {
      const guild = client.guilds.cache.get(id);
      if (!guild) throw new Error(`Guild with ID ${id} not found`);

      logger.send(`Fetching members for guild ${guild.name} (${guild.id})`);

      if (client.fetchedGuilds.has(guild.id)) {
        logger.send(`Members for guild ${guild.name} (${guild.id}) already fetched, skipped.`);
        return;
      }

      await guild.fetch();

      const members = await guild.members.fetch();
      client.fetchedGuilds.set(guild.id, true);
      logger.send(`Fetched members for guild ${guild.name} (${guild.id}) with ${members.size} members`);
    });

    await Promise.all(guildFetchPromises);

    logger.send(`Finished fetching members for guild(s) ${guildIdsToFetch.join(', ')}`);
  } catch (error) {
    logger.send(`Error fetching members:\n${error.stack}`);
    throw error;
  }
}

module.exports = fetchGuildsMembers;
