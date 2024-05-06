const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keywordsValidation = require('@/validations/servers/keywords');

const ServerSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    max: config.serverDescriptionMaxCharacters
  },
  category: {
    type: String,
    enum: config.serverCategories,
    required: true
  },
  keywords: {
    type: [String],
    required: true,
    validate: {
      validator: keywordsValidation,
      message: 'Keywords is not valid.'
    }
  },
  invite_code: {
    type: {
      type: String,
      enum: ['Vanity', 'Invite', 'Deleted'],
      required: true
    },
    code: {
      type: String,
      required: false
    }
  },
  votes: {
    type: Number,
    default: 0
  },
  voters: {
    type: [
      {
        user: {
          id: {
            type: String,
            required: true
          }
        },
        vote: {
          type: Number,
          required: true
        }
      }
    ] 
  },
  lastVoter: {
    user: {
      id: {
        type: String
      }
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  voice_activity_enabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  methods: {
    async toPubliclySafe() {
      const newServer = {};

      return {
        ...newServer,
        id: this.id,
        description: this.description,
        category: this.category,
        keywords: this.keywords,
        invite_code: this.invite_code,
        votes: this.votes,
        voice_activity_enabled: this.voice_activity_enabled
      };
    }
  }
});

module.exports = mongoose.model('Server', ServerSchema);