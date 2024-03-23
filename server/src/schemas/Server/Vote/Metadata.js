const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetadataSchema = new Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('VoteReminderMetadata', MetadataSchema);