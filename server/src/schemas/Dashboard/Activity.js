const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DashboardActivitySchema = new Schema({
  type: {
    type: String,
    enum: ['USER_ACTIVITY', 'MODERATOR_ACTIVITY'],
    required: true
  },
  user: {
    id: {
      type: String,
      required: true
    }
  },
  target: {
    type: {
      type: String,
      enum: ['USER', 'GUILD'],
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

DashboardActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 1209600 });

module.exports = mongoose.model('DashboardActivity', DashboardActivitySchema);