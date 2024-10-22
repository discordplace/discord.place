const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nameValidation = require('@/validations/emojis/name');

const EmojiSchema = new Schema({
  animated: {
    default: false,
    type: Boolean
  },
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
      const newEmoji = {};

      return {
        ...newEmoji,
        animated: this.animated,
        approved: this.approved,
        categories: this.categories,
        created_at: new Date(this.createdAt),
        downloads: this.downloads,
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

module.exports = mongoose.model('Emoji', EmojiSchema);