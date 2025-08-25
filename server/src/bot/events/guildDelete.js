const updateClientActivity = require('@/utils/updateClientActivity');
const Review = require('@/schemas/Server/Review');
const Reward = require('@/schemas/Server/Vote/Reward');

module.exports = async guild => {
  logger.info(`Kicked from guild ${guild.name} (${guild.id}).`);

  Promise.all([
    Review.deleteMany({ 'server.id': guild.id, approved: false }),
    Reward.deleteMany({ 'guild.id': guild.id })
  ]);

  updateClientActivity();
};