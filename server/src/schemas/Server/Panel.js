const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerPanelSchema = new Schema({
  channelId: {
    required: true,
    type: String
  },
  guildId: {
    required: true,
    type: String
  },
  messageId: {
    required: false,
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServerPanel', ServerPanelSchema);