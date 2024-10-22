const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BotVoteTimeoutSchema = new Schema({
  bot: {
    discriminator: {
      required: true,
      type: String
    },
    id: {
      required: true,
      type: String
    },
    username: {
      required: true,
      type: String
    }
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

BotVoteTimeoutSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('BotVoteTimeout', BotVoteTimeoutSchema);