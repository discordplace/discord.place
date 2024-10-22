const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BotReviewSchema = new Schema({
  approved: {
    default: false,
    type: Boolean
  },
  bot: {
    id: {
      required: true,
      type: String
    }
  },
  content: {
    max: 256,
    required: true,
    type: String
  },
  rating: {
    required: true,
    type: Number
  },
  user: {
    id: {
      required: true,
      type: String
    },
    username: {
      required: true,
      type: String
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BotReviews', BotReviewSchema);