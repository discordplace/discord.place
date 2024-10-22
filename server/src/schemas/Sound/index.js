const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesValidation = require('@/validations/sounds/categories');
const nameValidation = require('@/validations/sounds/name');

const SoundSchema = new Schema({
  approved: {
    default: false,
    type: Boolean
  },
  categories: {
    required: true,
    type: [
      {
        enum: config.soundCategories,
        type: String
      }
    ],
    validate: {
      message: ({ reason }) => reason.message,
      validator: categoriesValidation
    }
  },
  downloads: {
    default: 0,
    type: Number
  },
  id: {
    required: true,
    type: String
  },
  likers: {
    default: [],
    type: Array
  },
  name: {
    required: true,
    type: String,
    validate: {
      message: ({ reason }) => reason.message,
      validator: nameValidation
    }
  },
  publisher: {
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
    toPubliclySafe({ isLiked = false }) {
      return {
        approved: this.approved,
        categories: this.categories,
        createdAt: this.createdAt,
        downloadsCount: this.downloads,
        id: this.id,
        isLiked,
        likesCount: this.likers.length,
        name: this.name,
        publisher: {
          id: this.publisher.id,
          username: this.publisher.username
        }
      };
    }
  },
  timestamps: true
});

module.exports = mongoose.model('Sound', SoundSchema);