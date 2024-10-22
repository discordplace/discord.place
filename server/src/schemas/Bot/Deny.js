const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BotDenySchema = new Schema({
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
  reason: {
    description: {
      required: true,
      type: String
    },
    title: {
      required: true,
      type: String
    }
  },
  reviewer: {
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

BotDenySchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('BotDenies', BotDenySchema);