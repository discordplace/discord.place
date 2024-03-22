const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoiceActivitySchema = new Schema({
  guild: {
    id: {
      type: String,
      required: true
    }
  },
  data: {
    type: Array,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VoiceActivities', VoiceActivitySchema);