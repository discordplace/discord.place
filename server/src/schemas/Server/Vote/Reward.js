const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerVoteRewardSchema = new Schema({
  guild: {
    id: {
      type: String,
      required: true
    }
  },
  role: {
    id: {
      type: String,
      required: true
    }
  },
  required_votes: {
    type: Number,
    required: true
  }
}, { 
  timestamps: true
});

module.exports = mongoose.model('ServerVoteReward', ServerVoteRewardSchema);