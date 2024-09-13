module.exports = {
  get: (request, response) => {
    const data = client.guilds.cache.map(guild => guild).sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 5)
      .map((guild) => ({
        id: guild.id,
        name: guild.name,
        member_count: guild.memberCount,
        icon_url: guild.iconURL({ format: 'png', size: 32 })
      }));

    return response.json({
      data,
      totalServers: Math.round(client.guilds.cache.size)
    });
  }
};