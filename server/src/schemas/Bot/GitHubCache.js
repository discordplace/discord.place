const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GitHubCacheSchema = new Schema({
  data: {
    description: String,
    forks_count: Number,
    // We only need these fields from the GitHub API for now
    html_url: String,
    language: String,
    name: String,
    owner: {
      avatar_url: String,
      login: String
    },
    stargazers_count: Number
  }
}, {
  timestamps: true
});

GitHubCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('GitHubCache', GitHubCacheSchema);