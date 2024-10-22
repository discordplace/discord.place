const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DashboardDataSchema = new Schema({
  bots: {
    default: 0,
    type: Number
  },
  emojis: {
    default: 0,
    type: Number
  },
  guilds: {
    default: 0,
    type: Number
  },
  profiles: {
    default: 0,
    type: Number
  },
  servers: {
    default: 0,
    type: Number
  },
  sounds: {
    default: 0,
    type: Number
  },
  templates: {
    default: 0,
    type: Number
  },
  themes: {
    default: 0,
    type: Number
  },
  users: {
    default: 0,
    type: Number
  }
}, {
  timestamps: true
});

DashboardDataSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('DashboardData', DashboardDataSchema);