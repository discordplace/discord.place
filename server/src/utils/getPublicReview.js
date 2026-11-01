const getUserHashes = require('@/utils/getUserHashes');

module.exports = async function getPublicReview(review, options = {}) {
  const publiclySafeReview = review.toPubliclySafe(options);

  if (publiclySafeReview.reply) {
    const replyUserHashes = await getUserHashes(publiclySafeReview.reply.user.id);

    publiclySafeReview.reply.user.avatar = replyUserHashes.avatar;
  }

  return publiclySafeReview;
};
