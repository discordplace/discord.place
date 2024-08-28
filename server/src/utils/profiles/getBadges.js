function getBadges(profile, premiumSince) {
  const guild = client.guilds.cache.get(config.guildId);

  const badges = [
    {
      id: 'admin',
      condition: () => {
        const member = guild.members.cache.get(profile.user.id); 
        return member && member.roles.cache.has(config.roles.admin);
      }
    },
    {
      id: 'moderator',
      condition: () => {
        const member = guild.members.cache.get(profile.user.id); 
        return member && (
          member.roles.cache.has(config.roles.headModerator) ||
          member.roles.cache.has(config.roles.moderator) ||
          member.roles.cache.has(config.roles.jrModerator)
        );
      }
    },
    {
      id: 'verified',
      condition: () => profile.verified
    },
    {
      id: 'premium',
      condition: () => premiumSince
    }
  ];

  return badges.filter(badge => badge.condition()).map(badge => badge.id);
}

module.exports = getBadges;