const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerReviewSchema = new Schema({
  approved: {
    default: false,
    type: Boolean
  },
  content: {
    max: 256,
    required: true,
    type: String
  },
  rating: {
    required: true,
    type: Number
  },
  server: {
    id: {
      required: true,
      type: String
    }
  },
  user: {
    id: {
      required: true,
      type: String
    },
    username: {
      required: true,
      type: String
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServerReviews', ServerReviewSchema);