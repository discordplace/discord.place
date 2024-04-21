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
  about: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ReminderMetadata', MetadataSchema);