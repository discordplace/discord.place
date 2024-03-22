module.exports = async (oldGuild, newGuild) => {
  if (!oldGuild.available && newGuild.available) {
    logger.send(`${newGuild.name} became available, fetching members.. (${newGuild.id})`);
    await newGuild.members.fetch({ force: true }).then(() => logger.info(`Fetched members for guild ${newGuild.name} (${newGuild.id})`)).catch(error => {
      logger.send(`Error fetching members for guild ${newGuild.name} (${newGuild.id})`);
      logger.send(error.stack);
    });
  }
};