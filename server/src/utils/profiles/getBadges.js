function getBadges(profile, isPremium) {
  const badges = [
    {
      name: 'Moderator',
      condition: () => {
        const member = client.guilds.cache.get(config.guildId).members.cache.get(profile.user.id);
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