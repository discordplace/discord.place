const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetadataSchema = new Schema({
  documentId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  guildId: {
    required: true,
    type: String
  },
  userId: {
    required: true,
    type: String
  }
});

module.exports = mongoose.model('ServerVoteReminderMetadata', MetadataSchema);