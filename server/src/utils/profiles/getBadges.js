function getBadges(profile, isPremium) {
  const guild = client.guilds.cache.get(config.guildId);

  const badges = [
    {
      name: 'Moderator',
      condition: () => {
        const member = guild.members.cache.get(profile.user.id); 
        return member && member.roles.cache.has(config.roles.moderator);
      }
    },
    {
      name: 'Verified',
      condition: () => profile.verified
    },
    {
      name: 'Premium',
      condition: () => isPremium
    }
  ];

  return badges.filter(badge => badge.condition()).map(badge => badge.name);
}

module.exports = getBadges;