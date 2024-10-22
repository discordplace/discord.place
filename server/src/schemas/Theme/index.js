const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesValidation = require('@/validations/themes/categories');
const colorValidation = require('@/validations/themes/color');

const ThemeSchema = new Schema({
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
  colors: {
    primary: {
      type: String,
      required: true,
      validate: {
        validator: colorValidation,
        message: ({ reason }) => reason.message
      }
    },
    secondary: {
      type: String,
      required: true,
      validate: {
        validator: colorValidation,
        message: ({ reason }) => reason.message
      }
    }
  },
  categories: {
    type: [
      {
        type: String,
        enum: config.themeCategories
      }
    ],
    required: true,
    validate: {
      validator: categoriesValidation,
      message: ({ reason }) => reason.message
    }
  },
  approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  methods: {
    toPubliclySafe() {
      return {
        id: this.id,
        publisher: {
          id: this.publisher.id,
          username: this.publisher.username
        },
        colors: this.colors,
        categories: this.categories,
        approved: this.approved,
        createdAt: this.createdAt
      };
    }
  }
});

module.exports = mongoose.model('Theme', ThemeSchema);