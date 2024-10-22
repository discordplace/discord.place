function getBadges(profile, premiumSince) {
  const guild = client.guilds.cache.get(config.guildId);

  const badges = [
    {
      condition: () => {
        const member = guild.members.cache.get(profile.user.id);

        return member && member.roles.cache.has(config.roles.admin);
      },
      id: 'admin'
    },
    {
      condition: () => {
        const member = guild.members.cache.get(profile.user.id);

        return member && (
          member.roles.cache.has(config.roles.headModerator) ||
          member.roles.cache.has(config.roles.moderator) ||
          member.roles.cache.has(config.roles.jrModerator)
        );
      },
      id: 'moderator'
    },
    {
      condition: () => profile.verified,
      id: 'verified'
    },
    {
      condition: () => premiumSince,
      id: 'premium'
    }
  ];

  return badges.filter(badge => badge.condition()).map(badge => badge.id);
}

module.exports = getBadges;