const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerHashesSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false
  },
  banner: {
    type: String,
    required: false
  }
}, {
  timestamps: true,
  methods: {
    async getNewHashes() {
      logger.info(`Getting new hashes for server ${this.id}`);

      const guild = await client.guilds.fetch(this.id, { force: true }).catch(() => null);
      if (!guild) return null;

      this.icon = guild.icon;
      this.banner = guild.banner;

      await this.save();

      return {
        icon: guild.icon,
        banner: guild.banner
      };
    }
  }
});

module.exports = mongoose.model('ServerHashes', ServerHashesSchema);