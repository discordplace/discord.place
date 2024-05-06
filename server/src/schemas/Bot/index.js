const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesValidation = require('@/validations/bots/categories');
const inviteURLValidation = require('@/validations/bots/inviteUrl');
const Premium = require('@/schemas/Premium');
const encrypt = require('@/utils/encryption/encrypt');
const decrypt = require('@/utils/encryption/decrypt');

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
      message: error => error.message
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
      message: error => error.message
    }
  },
  server_count: {
    value: {
      type: Number,
      default: 0
    },
    updatedAt: {
      type: Date,
      default: Date.now
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
      const newBot = {};

      const user = client.users.cache.get(this.owner.id) || await client.users.fetch(this.owner.id).catch(() => null);   
      if (user) {
        const ownerHasPremium = await Premium.findOne({ 'user.id': user.id });

        Object.assign(newBot, {
          owner: {
            username: user.username,
            avatar_url: user.displayAvatarURL({ size: 256 }),
            premium: ownerHasPremium ? true : false
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
        avatar_url: bot.displayAvatarURL({ size: 256 }),
        banner_url: bot.bannerURL({ size: 1024, format: 'png' })
      });

      return {
        ...newBot,
        id: this.id,
        short_description: this.short_description,
        description: this.description,
        invite_url: this.invite_url,
        categories: this.categories,
        servers: this.server_count.value,
        servers_updated_at: this.server_count.updatedAt,
        commands: this.command_count.value,
        commands_updated_at: this.command_count.updatedAt,
        votes: this.votes,
        verified: this.verified
      };
    },
    encryptApiKey(apiKey) {
      return encrypt(apiKey, process.env.BOT_API_KEY_ENCRYPT_SECRET);
    },
    getDecryptedApiKey() {
      if (!this.api_key) return null;

      return decrypt(this.api_key, process.env.BOT_API_KEY_ENCRYPT_SECRET);
    },
  }
});

module.exports = mongoose.model('Bot', BotSchema);