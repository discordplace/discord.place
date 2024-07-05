const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesValidation = require('@/validations/sounds/categories');
const nameValidation = require('@/validations/sounds/name');

const SoundSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  publisher: {
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
      validator: nameValidation,
      message: ({ reason }) => reason.message
    }
  },
  categories: {
    type: [
      {
        type: String,
        enum: config.soundCategories
      }
    ],
    required: true,
    validate: {
      validator: categoriesValidation,
      message: ({ reason }) => reason.message
    }
  },
  likers: {
    type: Array,
    default: []
  },
  downloads: {
    type: Number,
    default: 0
  },
  approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  methods: {
    toPubliclySafe({ isLiked = false }) {
      return {
        id: this.id,
        publisher: {
          id: this.publisher.id,
          username: this.publisher.username
        },
        name: this.name,
        categories: this.categories,
        likesCount: this.likers.length,
        downloadsCount: this.downloads,
        isLiked,
        approved: this.approved,
        createdAt: this.createdAt
      };
    }
  }
});

module.exports = mongoose.model('Sound', SoundSchema);