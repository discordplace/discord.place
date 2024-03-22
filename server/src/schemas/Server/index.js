const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keywordsValidation = require('@/validations/servers/keywords');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');

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
        voters: [
          ...await Promise.all(this.voters
            .sort((a, b) => b.vote - a.vote)
            .map(async voter => {
              const user = client.users.cache.get(voter.user.id) || await client.users.fetch(voter.user.id).catch(() => null);
              
              return {
                user: {
                  id: voter.user.id,
                  username: user.username || 'Unknown',
                  avatar_url: user.displayAvatarURL({ format: 'png', size: 256 }) || 'https://cdn.discordapp.com/embed/avatars/0.png'
                },
                vote: voter.vote
              }; 
            }))
        ]
      };
    }
  }
});

const Model = mongoose.model('Server', ServerSchema);

Model.watch().on('change', async data => {
  if (data.operationType === 'update' && data.updateDescription.updatedFields.votes) {
    const server = await Model.findOne({ _id: data.documentKey._id });
    await updatePanelMessage(server.id);
  }
});

module.exports = Model;