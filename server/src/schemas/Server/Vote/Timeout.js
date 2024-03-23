const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteTimeoutSchema = new Schema({
  user: {
    id: {
      type: String,
      required: true
    }
  },
  guild: {
    id: {
      type: String,
      required: true
    }
  }
}, { 
  timestamps: true
});

VoteTimeoutSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('VoteTimeouts', VoteTimeoutSchema);