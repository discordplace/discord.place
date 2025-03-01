const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keywordsValidation = require('@/validations/servers/keywords');
const webhookUrlValidation = require('@/validations/servers/webhookUrl');
const Bot = require('@/schemas/Bot');

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
      message: ({ reason }) => reason.message
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
          },
          username: {
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
  last_voter: {
    user: {
      id: {
        type: String
      }
    },
    date: {
      type: Date
    }
  },
  webhook: {
    url: {
      type: String,
      required: false,
      validate: {
        validator: webhookUrlValidation,
        message: ({ reason }) => reason.message
      }
    },
    token: {
      type: String,
      max: config.serverWebhookTokenMaxLength,
      required: false
    },
    records: [
      {
        url: {
          type: String,
          required: true
        },
        response_status_code: {
          type: Number,
          required: true
        },
        request_body: {
          type: Object,
          required: false
        },
        created_at: {
          type: Date,
          required: true
        }
      }
    ]
  }
}, {
  timestamps: true,
  methods: {
    async toPubliclySafe() {
      const ServerVoteTripleEnabled = require('@/schemas/Server/Vote/TripleEnabled');
      const { StandedOutServer } = require('@/schemas/StandedOut');

      const newServer = {};

      const voteTripleEnabledData = await ServerVoteTripleEnabled.findOne({ id: this.id });
      if (voteTripleEnabledData) {
        newServer.vote_triple_enabled = {
          created_at: voteTripleEnabledData.createdAt
        };
      }

      const standedOutData = await StandedOutServer.findOne({ identifier: this.id });
      if (standedOutData) {
        newServer.standed_out = {
          created_at: standedOutData.createdAt
        };
      }

      return {
        ...newServer,
        id: this.id,
        description: this.description,
        category: this.category,
        keywords: this.keywords,
        invite_code: this.invite_code,
        votes: this.votes,
        totalVoters: this.voters.length
      };
    }
  }
});

ServerSchema.post('remove', async doc => {
  await Bot.updateMany({ support_server_id: doc.id }, { support_server_id: null });
});

module.exports = mongoose.model('Server', ServerSchema);