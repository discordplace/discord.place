const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetadataSchema = new Schema({
  about: {
    required: true,
    type: String
  },
  createdAt: {
    default: Date.now,
    type: Date
  },
  documentId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  userId: {
    required: true,
    type: String
  }
});

module.exports = mongoose.model('ReminderMetadata', MetadataSchema);