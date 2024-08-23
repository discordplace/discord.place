const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserHashesSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  avatar: {
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
  }
});

module.exports = mongoose.model('UserHashes', UserHashesSchema);