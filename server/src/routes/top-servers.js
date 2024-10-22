module.exports = {
  get: (request, response) => {
    const data = client.guilds.cache.map(guild => guild).sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 5)
      .map(guild => ({
        icon_url: guild.iconURL({ format: 'png', size: 32 }),
        id: guild.id,
        member_count: guild.memberCount,
        name: guild.name
      }));

    return response.json({
      data,
      totalServers: Math.round(client.guilds.cache.size)
    });
  }
};