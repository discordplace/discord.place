const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerPanelSchema = new Schema({
  guildId: {
    type: String,
    required: true
  },
  channelId: {
    type: String,
    required: true
  },
  messageId: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServerPanel', ServerPanelSchema);