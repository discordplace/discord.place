const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerVoteTimeoutSchema = new Schema({
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
  guild: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

ServerVoteTimeoutSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('ServerVoteTimeouts', ServerVoteTimeoutSchema);