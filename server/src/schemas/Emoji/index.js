const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nameValidation = require('@/validations/emojis/name');

const EmojiSchema = new Schema({
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
  animated: {
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  methods: {
    toPubliclySafe() {
      const newEmoji = {};

      return {
        ...newEmoji,
        id: this.id,
        user: {
          id: this.user.id,
          username: this.user.username
        },
        name: this.name,
        categories: this.categories,
        downloads: this.downloads,
        animated: this.animated,
        approved: this.approved,
        created_at: new Date(this.createdAt)
      };
    }
  }
});

module.exports = mongoose.model('Emoji', EmojiSchema);