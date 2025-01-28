const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetadataSchema = new Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  ip: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('BlockedIpsMetadata', MetadataSchema);