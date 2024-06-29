const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GitHubCacheSchema = new Schema({
  data: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});

GitHubCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('GitHubCache', GitHubCacheSchema);