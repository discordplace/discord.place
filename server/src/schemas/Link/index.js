const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  createdBy: {
    id: {
      required: true,
      type: String
    },
    username: {
      required: true,
      type: String
    }
  },
  id: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  redirectTo: {
    required: true,
    type: String
  },
  visits: {
    default: 0,
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Link', LinkSchema);