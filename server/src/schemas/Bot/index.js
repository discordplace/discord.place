const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('@/schemas/User');
const decrypt = require('@/utils/encryption/decrypt');
const encrypt = require('@/utils/encryption/encrypt');
const getUserHashes = require('@/utils/getUserHashes');
const categoriesValidation = require('@/validations/bots/categories');
const githubRepositoryValidation = require('@/validations/bots/githubRepository');
const inviteURLValidation = require('@/validations/bots/inviteUrl');
const webhookUrlValidation = require('@/validations/bots/webhookUrl');

const BotSchema = new Schema({
  api_key: {
    encryptedText: {
      required: false,
      type: String
    },
    iv: {
      required: false,
      type: String
    },
    tag: {
      required: false,
      type: String
    }
  },
  categories: {
    required: true,
    type: [
      {
        enum: config.botCategories,
        type: String
      }
    ],
    validate: {
      message: ({ reason }) => reason.message,
      validator: categoriesValidation
    }
  },
  command_count: {
    updatedAt: {
      default: Date.now,
      type: Date
    },
    value: {
      default: 0,
      type: Number
    }
  },
  data: {
    required: false,
    type: Object
  },
  description: {
    max: config.botDescriptionMaxLength,
    min: config.botDescriptionMinLength,
    required: true,
    type: String
  },
  extra_owners: {
    default: [],
    required: false,
    type: [
      {
        type: String
      }
    ]
  },
  github_repository: {
    default: null,
    required: false,
    type: String,
    validate: {
      message: ({ reason }) => reason.message,
      validator: githubRepositoryValidation
    }
  },
  id: {
    required: true,
    type: String
  },
  invite_url: {
    required: true,
    type: String,
    validate: {
      message: ({ reason }) => reason.message,
      validator: inviteURLValidation
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
  owner: {
    id: {
      required: true,
      type: String
    }
  },
  server_count: {
    updatedAt: {
      default: 0,
      type: Date
    },
    value: {
      default: 0,
      type: Number
    }
  },
  short_description: {
    max: config.botShortDescriptionMaxLength,
    min: config.botShortDescriptionMinLength,
    required: true,
    type: String
  },
  support_server_id: {
    required: false,
    type: String
  },
  verified: {
    default: false,
    type: Boolean
  },
  voters: {
    type: [
      {
        lastVote: {
          default: Date.now,
          type: Date
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
      max: config.botWebhookTokenMaxLength,
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
    encryptApiKey(apiKey) {
      return encrypt(apiKey, process.env.BOT_API_KEY_ENCRYPT_SECRET);
    },
    getDecryptedApiKey() {
      if (!this.api_key) return null;

      return decrypt(this.api_key, process.env.BOT_API_KEY_ENCRYPT_SECRET);
    },
    async toPubliclySafe() {
      const BotVoteTripleEnabled = require('@/schemas/Bot/Vote/TripleEnabled');
      const { StandedOutBot } = require('@/schemas/StandedOut');

      const newBot = {};

      const voteTripleEnabledData = await BotVoteTripleEnabled.findOne({ id: this.id });
      if (voteTripleEnabledData) {
        newBot.vote_triple_enabled = {
          created_at: voteTripleEnabledData.createdAt
        };
      }

      const standedOutBotData = await StandedOutBot.findOne({ identifier: this.id });
      if (standedOutBotData) {
        newBot.standed_out = {
          created_at: standedOutBotData.createdAt
        };
      }

      const user = await User.findOne({ id: this.owner.id });
      if (user) {
        const ownerHasPremium = user.subscription && user.subscription.createdAt;
        const userHashes = await getUserHashes(user.id);

        Object.assign(newBot, {
          owner: {
            avatar: userHashes.avatar,
            id: user.id,
            premium: !!ownerHasPremium,
            subscriptionCreatedAt: ownerHasPremium ? new Date(user.subscription.createdAt).getTime() : null,
            username: user.data.username
          }
        });
      } else {
        Object.assign(newBot, {
          owner: {
            id: this.owner.id
          }
        });
      }

      const botHashes = await getUserHashes(this.id);

      return {
        ...newBot,
        avatar: botHashes.avatar,
        banner: botHashes.banner,
        categories: this.categories,
        commands: this.command_count.value,
        commands_updated_at: this.command_count.updatedAt,
        created_at: this.createdAt,
        description: this.description,
        discriminator: this.data.discriminator,
        flags: this.data.flags,
        github_repository: this.github_repository,
        id: this.id,
        invite_url: this.invite_url,
        servers: this.server_count.value,
        servers_updated_at: this.server_count.updatedAt,
        short_description: this.short_description,
        totalVoters: this.voters.length,
        username: this.data.username,
        verified: this.verified,
        votes: this.votes
      };
    }
  },
  timestamps: true
});

module.exports = mongoose.model('Bot', BotSchema);