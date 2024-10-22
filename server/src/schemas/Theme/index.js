const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesValidation = require('@/validations/themes/categories');
const colorValidation = require('@/validations/themes/color');

const ThemeSchema = new Schema({
  approved: {
    default: false,
    type: Boolean
  },
  categories: {
    required: true,
    type: [
      {
        enum: config.themeCategories,
        type: String
      }
    ],
    validate: {
      message: ({ reason }) => reason.message,
      validator: categoriesValidation
    }
  },
  colors: {
    primary: {
      required: true,
      type: String,
      validate: {
        message: ({ reason }) => reason.message,
        validator: colorValidation
      }
    },
    secondary: {
      required: true,
      type: String,
      validate: {
        message: ({ reason }) => reason.message,
        validator: colorValidation
      }
    }
  },
  id: {
    required: true,
    type: String
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
    toPubliclySafe() {
      return {
        approved: this.approved,
        categories: this.categories,
        colors: this.colors,
        createdAt: this.createdAt,
        id: this.id,
        publisher: {
          id: this.publisher.id,
          username: this.publisher.username
        }
      };
    }
  },
  timestamps: true
});

module.exports = mongoose.model('Theme', ThemeSchema);