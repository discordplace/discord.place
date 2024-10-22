const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bot = require('@/schemas/Bot');
const keywordsValidation = require('@/validations/servers/keywords');
const webhookUrlValidation = require('@/validations/servers/webhookUrl');

const ServerSchema = new Schema({
  category: {
    enum: config.serverCategories,
    required: true,
    type: String
  },
  description: {
    max: config.serverDescriptionMaxCharacters,
    required: true,
    type: String
  },
  id: {
    required: true,
    type: String
  },
  invite_code: {
    code: {
      required: false,
      type: String
    },
    type: {
      enum: ['Vanity', 'Invite', 'Deleted'],
      required: true,
      type: String
    }
  },
  keywords: {
    required: true,
    type: [String],
    validate: {
      message: ({ reason }) => reason.message,
      validator: keywordsValidation
    }
  },
  last_voter: {
    date: {
      type: Date
    },
    user: {
      id: {
        type: String
      }
    }
  },
  voters: {
    type: [
      {
        user: {
          id: {
            required: true,
            type: String
          },
          username: {
            required: true,
            type: String
          }
        },
        vote: {
          required: true,
          type: Number
        }
      }
    ]
  },
  votes: {
    default: 0,
    type: Number
  },
  webhook: {
    records: [
      {
        created_at: {
          required: true,
          type: Date
        },
        request_body: {
          required: false,
          type: Object
        },
        response_body: {
          required: false,
          type: String
        },
        response_status_code: {
          required: true,
          type: Number
        },
        url: {
          required: true,
          type: String
        }
      }
    ],
    token: {
      max: config.serverWebhookTokenMaxLength,
      required: false,
      type: String
    },
    url: {
      required: false,
      type: String,
      validate: {
        message: ({ reason }) => reason.message,
        validator: webhookUrlValidation
      }
    }
  }
}, {
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
        category: this.category,
        description: this.description,
        id: this.id,
        invite_code: this.invite_code,
        keywords: this.keywords,
        votes: this.votes
      };
    }
  },
  timestamps: true
});

ServerSchema.post('remove', async doc => {
  await Bot.updateMany({ support_server_id: doc.id }, { support_server_id: null });
});

module.exports = mongoose.model('Server', ServerSchema);