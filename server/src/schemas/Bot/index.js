const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesValidation = require('@/validations/bots/categories');
const inviteURLValidation = require('@/validations/bots/inviteUrl');
const githubRepositoryValidation = require('@/validations/bots/githubRepository');
const webhookUrlValidation = require('@/validations/bots/webhookUrl');
const User = require('@/schemas/User');
const encrypt = require('@/utils/encryption/encrypt');
const decrypt = require('@/utils/encryption/decrypt');
const getUserHashes = require('@/utils/getUserHashes');

const BotSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: false
  },
  owner: {
    id: {
      type: String,
      required: true
    }
  },
  extra_owners: {
    type: [
      {
        type: String
      }
    ],
    required: false,
    default: []
  },
  short_description: {
    type: String,
    required: true,
    min: config.botShortDescriptionMinLength,
    max: config.botShortDescriptionMaxLength
  },
  description: {
    type: String,
    required: true,
    min: config.botDescriptionMinLength,
    max: config.botDescriptionMaxLength
  },
  invite_url: {
    type: String,
    required: true,
    validate: {
      validator: inviteURLValidation,
      message: ({ reason }) => reason.message
    }
  },
  categories: {
    type: [
      {
        type: String,
        enum: config.botCategories
      }
    ],
    required: true,
    validate: {
      validator: categoriesValidation,
      message: ({ reason }) => reason.message
    }
  },
  support_server_id: {
    type: String,
    required: false
  },
  github_repository: {
    type: String,
    validate: {
      validator: githubRepositoryValidation,
      message: ({ reason }) => reason.message
    },
    required: false,
    default: null
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
      max: config.botWebhookTokenMaxLength,
      required: false
    }
  },
  command_count: {
    value: {
      type: Number,
      default: 0
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  server_count: {
    value: {
      type: Number,
      default: 0
    },
    updatedAt: {
      type: Date,
      default: 0
    }
  },
  votes: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
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
        },
        lastVote: {
          type: Date,
          default: Date.now
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
  api_key: {
    iv: {
      type: String,
      required: false
    },
    encryptedText: {
      type: String,
      required: false
    },
    tag: {
      type: String,
      required: false
    }
  }
}, {
  timestamps: true,
  methods: {
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
            id: user.id,
            username: user.data.username,
            avatar: userHashes.avatar,
            premium: ownerHasPremium ? true : false,
            subscriptionCreatedAt: ownerHasPremium ? new Date(user.subscription.createdAt).getTime() : null
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
        id: this.id,
        username: this.data.username,
        discriminator: this.data.discriminator,
        flags: this.data.flags,
        avatar: botHashes.avatar,
        banner: botHashes.banner,
        short_description: this.short_description,
        description: this.description,
        invite_url: this.invite_url,
        categories: this.categories,
        commands: this.command_count.value,
        commands_updated_at: this.command_count.updatedAt,
        servers: this.server_count.value,
        servers_updated_at: this.server_count.updatedAt,
        votes: this.votes,
        totalVoters: this.voters.length,
        verified: this.verified,
        github_repository: this.github_repository,
        created_at: this.createdAt
      };
    },
    encryptApiKey(apiKey) {
      return encrypt(apiKey, process.env.BOT_API_KEY_ENCRYPT_SECRET);
    },
    getDecryptedApiKey() {
      if (!this.api_key) return null;

      return decrypt(this.api_key, process.env.BOT_API_KEY_ENCRYPT_SECRET);
    }
  }
});

module.exports = mongoose.model('Bot', BotSchema);