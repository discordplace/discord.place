const updateClientActivity = require('@/utils/updateClientActivity');
const Review = require('@/schemas/Server/Review');
const Reward = require('@/schemas/Server/Vote/Reward');
const sendWebhookLog = require('@/utils/sendWebhookLog');

module.exports = async guild => {
  logger.info(`Kicked from guild ${guild.name} (${guild.id}).`);

  Promise.all([
    Review.deleteMany({ 'server.id': guild.id, approved: false }),
    Reward.deleteMany({ 'guild.id': guild.id })
  ]);

  updateClientActivity();

  sendWebhookLog(
    'leavedGuild',
    [
      { type: 'guild', name: 'Guild', value: guild.id },
      { type: 'number', name: 'Members', value: guild.memberCount },
      { type: 'owner', name: 'Owner', value: guild.ownerId }
    ],
    [
      { label: 'View Owner', url: `${config.frontendUrl}/profile/u/${guild.ownerId}` }
    ]
  );
};