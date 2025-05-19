const Server = require('@/schemas/Server');

module.exports = {
  get: async (request, response) => {
    const servers = await Server.find({ id: { $in: client.guilds.cache.map(guild => guild.id) } });

    const data = client.guilds.cache.map(guild => guild).sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 5)
      .map(guild => ({
        id: guild.id,
        name: guild.name,
        member_count: guild.memberCount,
        icon_url: guild.iconURL({ size: 32 }),
        is_listed: servers.some(server => server.id === guild.id)
      }));

    return response.json({
      data,
      totalServers: Math.round(client.guilds.cache.size)
    });
  }
};