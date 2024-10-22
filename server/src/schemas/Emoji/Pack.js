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
    },
    username: {
      type: String,
      required: true
    }
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: value => nameValidation(value),
      message: ({ reason }) => reason.message
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
      validator: value => {
        if (value.length > config.packagesMaxEmojisLength) return false;
        if (value.length < config.packagesMinEmojisLength) return false;

        return true;
      },
      message: ({ reason }) => reason.message
    }
  }
}, {
  timestamps: true,
  methods: {
    toPubliclySafe() {
      const newEmojiPackage = {};

      return {
        ...newEmojiPackage,
        id: this.id,
        user: {
          id: this.user.id,
          username: this.user.username
        },
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