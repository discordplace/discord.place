const Reward = require('@/schemas/Server/Vote/Reward');

module.exports = async role => {
  const rewards = await Reward.find({ 'role.id': role.id });

  if (rewards.length) {
    await Reward.deleteMany({ 'role.id': role.id });

    logger.info(`Role ${role.id} has been deleted. Deleted ${rewards.length} vote rewards that associated with the role.`);
  }
};