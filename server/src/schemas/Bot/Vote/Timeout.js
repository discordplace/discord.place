const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BotVoteTimeoutSchema = new Schema({
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
  bot: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    discriminator: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

BotVoteTimeoutSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('BotVoteTimeout', BotVoteTimeoutSchema);