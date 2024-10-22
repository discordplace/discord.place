const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerLogChannelSchema = new Schema({
  channelId: {
    required: true,
    type: String
  },
  guildId: {
    required: true,
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServerLogChannel', ServerLogChannelSchema);