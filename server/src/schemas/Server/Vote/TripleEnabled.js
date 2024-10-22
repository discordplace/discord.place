const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BotVoteTripleEnabledSchema = new Schema({
  id: {
    required: true,
    type: String
  }
}, {
  timestamps: true
});

BotVoteTripleEnabledSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('ServerVoteTripleEnabled', BotVoteTripleEnabledSchema);