const Review = require('@/schemas/Server/Review');
const Reward = require('@/schemas/Server/Vote/Reward');

module.exports = guild => Promise.all(
  Review.deleteMany({ 'server.id': guild.id, approved: false }),
  Reward.deleteMany({ 'guild.id': guild.id })
);