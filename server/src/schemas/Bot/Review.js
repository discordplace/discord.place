const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewReplySchema = new Schema({
  content: {
    type: String,
    required: true,
    max: config.reviewReplyMaxCharacters
  },
  approved: {
    type: Boolean,
    default: false
  },
  user: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false
});

const BotReviewSchema = new Schema({
  bot: {
    id: {
      type: String,
      required: true
    }
  },
  user: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  rating: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true,
    max: 256
  },
  reply: {
    type: ReviewReplySchema,
    default: null
  },
  approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

BotReviewSchema.methods.toPubliclySafe = function(options = {}) {
  const review = this.toJSON();

  if (review.reply && !review.reply.approved && !options.includePendingReply) delete review.reply;

  return review;
};

module.exports = mongoose.model('BotReviews', BotReviewSchema);