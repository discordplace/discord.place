const axios = require('axios');

async function getApproximateGuildCount(botId) {
  if (!process.env.DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL) throw new Error('DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL environment variable is missing');
  if (!process.env.DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET) throw new Error('DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET environment variable is missing');

  if (client.approximateGuildCountFetchedBots.has(botId)) return client.approximateGuildCountFetchedBots.get(botId);
  
  try {
    const response = await axios.get(`${process.env.DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL}/bots/${botId}`, {
      headers: {
        'authorization': process.env.DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET
      }
    });

    if (response.status === 200) {
      client.approximateGuildCountFetchedBots.set(botId, { 
        approximate_guild_count: response.data.approximate_guild_count, 
        fetchedAt: response.data.fetchedAt 
      });
      
      return {
        approximate_guild_count: response.data.approximate_guild_count,
        fetchedAt: response.data.fetchedAt
      };
    }
  } catch (error) {
    logger.send(`There was an error while fetching approximate guild count for bot with ID ${botId}:\n${error.stack}`);
    
    return null;
  }
}

module.exports = getApproximateGuildCount;