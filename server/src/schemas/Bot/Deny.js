const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BotDenySchema = new Schema({
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
    }
  },
  reviewer: {
    id: {
      type: String,
      required: true
    }
  },
  reason: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

BotDenySchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('BotDenies', BotDenySchema);