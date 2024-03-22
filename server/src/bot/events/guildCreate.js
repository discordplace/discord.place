module.exports = async guild => {
  logger.send(`Joined guild ${guild.name} fetching members.. (${guild.id})`);
  await guild.members.fetch({ force: true }).then(() => logger.send(`Fetched members for guild ${guild.name} (${guild.id})`)).catch(error => {
    logger.send(`Error fetching members for guild ${guild.name} (${guild.id})`);
    logger.send(error.stack);
  });
};