const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerLogChannelSchema = new Schema({
  guildId: {
    type: String,
    required: true
  },
  channelId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServerLogChannel', ServerLogChannelSchema);