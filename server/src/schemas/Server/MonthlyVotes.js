const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerMonthlyVotesSchema = new Schema({
  guildId: {
    type: String,
    required: true
  },
  data: [
    {
      month: {
        type: Number,
        required: true
      },
      year: {
        type: Number,
        required: true
      },
      votes: {
        type: Number,
        required: true
      },
      created_at: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('ServerMonthlyVotes', ServerMonthlyVotesSchema);