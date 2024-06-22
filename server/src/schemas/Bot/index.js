const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesValidation = require('@/validations/bots/categories');
const inviteURLValidation = require('@/validations/bots/inviteUrl');
const webhookUrlValidation = require('@/validations/bots/webhookUrl');
const User = require('@/schemas/User');
const encrypt = require('@/utils/encryption/encrypt');
const decrypt = require('@/utils/encryption/decrypt');
const getApproximateGuildCount = require('@/utils/bots/getApproximateGuildCount');

const BotSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  owner: {
    id: {
      type: String,
      required: true
    }
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
      type: Date,
      default: Date.now
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

      const newBot = {};

      const voteTripleEnabledData = await BotVoteTripleEnabled.findOne({ id: this.id });
      if (voteTripleEnabledData) {
        newBot.vote_triple_enabled = {
          created_at: voteTripleEnabledData.createdAt
        };
      }

      const user = client.users.cache.get(this.owner.id) || await client.users.fetch(this.owner.id).catch(() => null);   
      if (user) {
        const ownerHasPremium = await User.exists({ id: user.id, subscription: { $ne: null } }); 

        Object.assign(newBot, {
          owner: {
            id: user.id,
            username: user.username,
            avatar_url: user.displayAvatarURL({ size: 256 }),
            premium: !!ownerHasPremium
          }
        });
      }

      if (!client.forceFetchedUsers.has(this.id)) {
        await client.users.fetch(this.id, { force: true }).catch(() => null);
        client.forceFetchedUsers.set(this.id, true);
      }

      const bot = client.users.cache.get(this.id);      
      if (bot) Object.assign(newBot, {
        username: bot.username,
        discriminator: bot.discriminator,
        avatar_url: bot.displayAvatarURL({ size: 256 }),
        banner_url: bot.bannerURL({ size: 1024, format: 'png' })
      });

      if ((Date.now() - new Date(this.server_count.updatedAt).getTime()) >= 86400000) {
        logger.info(`Bot with ID ${this.id} has not been updated in 24 hours. Fetching new server count...`);

        await getApproximateGuildCount(this.id)
          .then(async approximate_guild_count_data => {
            if (!approximate_guild_count_data) logger.error(`Bot with ID ${this.id} could not be updated with new server count.`);
            else {
              this.server_count = {
                value: approximate_guild_count_data.approximate_guild_count,
                updatedAt: new Date()
              };

              await this.save();

              logger.info(`Bot with ID ${this.id} has been updated with new server count.`);
            }
          })
          .catch(error => logger.error(`There was an error while updating bot with ID ${this.id} with new server count:`, error));
      }

      return {
        ...newBot,
        id: this.id,
        short_description: this.short_description,
        description: this.description,
        invite_url: this.invite_url,
        categories: this.categories,
        commands: this.command_count.value,
        commands_updated_at: this.command_count.updatedAt,
        servers: this.server_count.value,
        servers_updated_at: this.server_count.updatedAt,
        votes: this.votes,
        verified: this.verified,
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