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
    async toPubliclySafe() {
      const newEmoji = {};

      const user = await client.users.fetch(this.user.id).catch(() => null);
      if (user) Object.assign(newEmoji, {
        user: {
          id: user.id,
          username: user.username,
          avatar_url: user.displayAvatarURL({ size: 256 })
        }
      });

      return {
        ...newEmoji,
        id: this.id,
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