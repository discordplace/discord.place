const LogChannel = require('@/schemas/Server/LogChannel');

async function sendLog(guildId, message) {
  const logChannel = await LogChannel.findOne({ guildId });
  if (!logChannel) throw new Error(`Log channel not found for guild ${guildId}`);

  const channel = client.channels.cache.get(logChannel.channelId);
  if (!channel) {
    await LogChannel.deleteOne({ guildId });
    throw new Error(`Log channel not found for guild ${guildId}`);
  }

  return channel.send({ content: `- \`[${new Date().toLocaleString(await channel.guild.getLanguage())}]\` ${message}`, allowedMentions: { parse: [] } });
}

module.exports = sendLog;