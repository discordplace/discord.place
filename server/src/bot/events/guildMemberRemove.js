const Bot = require('@/schemas/Bot');
const VoteTimeout = require('@/schemas/Bot/Vote/Timeout');

module.exports = async member => {
  if (member.user.bot && member.guild.id == config.guildId) {
    const bot = await Bot.findOne({ id: member.user.id });
    if (bot) {
      await bot.deleteOne();
      await VoteTimeout.deleteMany({ 'bot.id': member.user.id });

      logger.send(`Bot ${member.user.tag} (${member.user.id}) is no longer in the server. Removed from the database.`);
    }
  }
};