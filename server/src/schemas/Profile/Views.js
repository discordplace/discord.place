const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileViewsSchema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    required: true
  },
  ip: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

ProfileViewsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('ProfileViews', ProfileViewsSchema);