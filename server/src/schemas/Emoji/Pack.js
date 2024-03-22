const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nameValidation = require('@/validations/emojis/name');

const EmojiPackSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  user: {
    id: {
      type: String,
      required: true
    }
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: value => nameValidation(value),
      message: ({ value }) => `${value} should be a valid emoji name.`
    }
  },
  categories: {
    type: [
      {
        type: String,
        enum: config.emojiCategories
      }
    ],
    required: true,
    max: config.emojiMaxCategoriesLength
  },
  downloads: {
    type: Number,
    default: 0
  },
  approved: {
    type: Boolean,
    default: false
  },
  emoji_ids: {
    type: [
      {
        id: {
          type: String,
          required: true
        },
        animated: {
          type: Boolean,
          required: true
        }
      }
    ],
    required: true,
    validate: {
      validator: value =>  {
        if (value.length > config.packagesMaxEmojisLength) return false;
        if (value.length < config.packagesMinEmojisLength) return false;
        return true;
      },
      message: () => 'Emoji packs support a minimum of 4 and a maximum of 9 emoji.'
    }
  }
}, {
  timestamps: true,
  methods: {
    async toPubliclySafe() {
      const newEmojiPackage = {};
 
      const user = await client.users.fetch(this.user.id).catch(() => null);
      if (user) Object.assign(newEmojiPackage, {
        user: {
          id: user.id,
          username: user.username,
          avatar_url: user.displayAvatarURL({ size: 256 })
        }
      });

      return {
        ...newEmojiPackage,
        id: this.id,
        name: this.name,
        categories: this.categories,
        downloads: this.downloads,
        approved: this.approved,
        emoji_ids: this.emoji_ids,
        created_at: new Date(this.createdAt)
      };
    }
  }
});

module.exports = mongoose.model('EmojiPack', EmojiPackSchema);