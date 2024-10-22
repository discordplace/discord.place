const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GitHubCacheSchema = new Schema({
  data: {
    // We only need these fields from the GitHub API for now
    html_url: String,
    language: String,
    owner: {
      login: String,
      avatar_url: String
    },
    name: String,
    description: String,
    stargazers_count: Number,
    forks_count: Number
  }
}, {
  timestamps: true
});

GitHubCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('GitHubCache', GitHubCacheSchema);