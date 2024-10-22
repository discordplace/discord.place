const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserHashesSchema = new Schema({
  avatar: {
    required: false,
    type: String
  },
  banner: {
    required: false,
    type: String
  },
  id: {
    required: true,
    type: String
  }
}, {
  methods: {
    async getNewHashes() {
      logger.info(`Getting new hashes for user ${this.id}`);

      const user = await client.users.fetch(this.id, { force: true }).catch(() => null);
      if (!user) return null;

      this.avatar = user.avatar;
      this.banner = user.banner;

      await this.save();

      return {
        avatar: user.avatar,
        banner: user.banner
      };
    }
  },
  timestamps: true
});

module.exports = mongoose.model('UserHashes', UserHashesSchema);