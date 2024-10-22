const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerVoteRewardSchema = new Schema({
  guild: {
    id: {
      required: true,
      type: String
    }
  },
  required_votes: {
    required: true,
    type: Number
  },
  role: {
    id: {
      required: true,
      type: String
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServerVoteReward', ServerVoteRewardSchema);