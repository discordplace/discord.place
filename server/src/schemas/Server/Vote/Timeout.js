const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerVoteTimeoutSchema = new Schema({
  guild: {
    id: {
      required: true,
      type: String
    },
    name: {
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

ServerVoteTimeoutSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('ServerVoteTimeouts', ServerVoteTimeoutSchema);