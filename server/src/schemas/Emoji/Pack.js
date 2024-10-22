const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nameValidation = require('@/validations/emojis/name');

const EmojiPackSchema = new Schema({
  approved: {
    default: false,
    type: Boolean
  },
  categories: {
    max: config.emojiMaxCategoriesLength,
    required: true,
    type: [
      {
        enum: config.emojiCategories,
        type: String
      }
    ]
  },
  downloads: {
    default: 0,
    type: Number
  },
  emoji_ids: {
    required: true,
    type: [
      {
        animated: {
          required: true,
          type: Boolean
        },
        id: {
          required: true,
          type: String
        }
      }
    ],
    validate: {
      message: ({ reason }) => reason.message,
      validator: value => {
        if (value.length > config.packagesMaxEmojisLength) return false;
        if (value.length < config.packagesMinEmojisLength) return false;

        return true;
      }
    }
  },
  id: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String,
    validate: {
      message: ({ reason }) => reason.message,
      validator: value => nameValidation(value)
    }
  },
  user: {
    id: {
      required: true,
      type: String
    },
    username: {
      required: true,
      type: String
    }
  }
}, {
  methods: {
    toPubliclySafe() {
      const newEmojiPackage = {};

      return {
        ...newEmojiPackage,
        approved: this.approved,
        categories: this.categories,
        created_at: new Date(this.createdAt),
        downloads: this.downloads,
        emoji_ids: this.emoji_ids,
        id: this.id,
        name: this.name,
        user: {
          id: this.user.id,
          username: this.user.username
        }
      };
    }
  },
  timestamps: true
});

module.exports = mongoose.model('EmojiPack', EmojiPackSchema);