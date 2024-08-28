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
      // tooltip: `Premium since ${new Date(premiumSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      condition: () => premiumSince
    }
  ];

  return badges.filter(badge => badge.condition()).map(badge => ({ name: badge.name, tooltip: badge.tooltip || badge.name }));
}

module.exports = getBadges;