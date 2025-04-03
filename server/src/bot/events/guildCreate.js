const updateClientActivity = require('@/utils/updateClientActivity');
const ServerLanguage = require('@/schemas/Server/Language');
const sendWebhookLog = require('@/utils/sendWebhookLog');

module.exports = async guild => {
  logger.info(`Joined guild ${guild.name} (${guild.id}).`);

  updateClientActivity();

  sendWebhookLog(
    'joinedGuild',
    [
      { type: 'guild', name: 'Guild', value: guild.id },
      { type: 'number', name: 'Members', value: guild.memberCount },
      { type: 'owner', name: 'Owner', value: guild.ownerId }
    ],
    [
      { label: 'View Owner', url: `${config.frontendUrl}/profile/u/${guild.ownerId}` }
    ]
  );

  // Set the guild's language to the preferred locale if it's supported by us
  const foundLanguage = config.availableLocales.find(locale => locale.code === guild.preferredLocale.split('-')[0]);
  if (foundLanguage) {
    await ServerLanguage.findOneAndUpdate(
      { id: guild.id },
      { id: guild.id, language: foundLanguage.code },
      { upsert: true }
    );
  }

};