function getBadges(profile, premiumSince) {
  const guild = client.guilds.cache.get(config.guildId);

  const badges = [
    {
      name: 'Admin',
      condition: () => {
        const member = guild.members.cache.get(profile.user.id); 
        return member && member.roles.cache.has(config.roles.admin);
      }
    },
    {
      name: 'Moderator',
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
      name: 'Verified',
      condition: () => profile.verified
    },
    {
      name: 'Premium',
      tooltip: `Premium since ${new Date(premiumSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      condition: () => premiumSince
    }
  ];

  return badges.filter(badge => badge.condition()).map(badge => ({ name: badge.name, tooltip: badge.tooltip || badge.name }));
}

module.exports = getBadges;