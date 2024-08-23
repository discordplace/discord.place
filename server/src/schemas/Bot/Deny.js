const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BotDenySchema = new Schema({
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
  },
  user: {
    id: {
      type: String,
      required: true
    }
  },
  reviewer: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  reason: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

BotDenySchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('BotDenies', BotDenySchema);