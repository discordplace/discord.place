const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  createdBy: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  name: {
    type: String,
    required: true
  },
  redirectTo: {
    type: String,
    required: true
  },
  visits: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Link', LinkSchema);