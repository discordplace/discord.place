const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function convertToHex(color) {
  return `#${color.toString(16).padStart(6, '0')}`;
}

const TemplateSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
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
  name: {
    type: String,
    required: true,
    max: config.templateMaxNameLength
  },
  description: {
    type: String,
    required: true,
    min: config.templateMinDescriptionLength,
    max: config.templateMaxDescriptionLength
  },
  categories: {
    type: [
      {
        type: String,
        enum: config.templateCategories
      }
    ],
    required: true,
    max: config.templateMaxCategoriesLength
  },
  uses: {
    type: Number,
    default: 0
  },
  approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  methods: {
    toPubliclySafe() {
      const newTemplate = {};

      return {
        ...newTemplate,
        id: this.id,
        user: {
          id: this.user.id,
          username: this.user.username
        },
        name: this.name,
        description: this.description,
        categories: this.categories,
        uses: this.uses,
        approved: this.approved,
        created_at: new Date(this.createdAt),
        data: {
          channels: [
            ...this.data.channels.filter(({ type, parent_id }) => type !== 4 && !parent_id)
              .map(channel => ({
                id: channel.id,
                type: (
                  channel.type === 4 ? 'category' :
                    channel.type === 0 ? 'text' :
                      'voice'
                ),
                name: channel.name,
                defaultFocused: this.data.channels.filter(({ type }) => type !== 4)[0].id === channel.id,
                topic: channel.topic
              })),
            ...this.data.channels.filter(({ type }) => type === 4)
              .map(category => ({
                id: category.id,
                type: 'category',
                name: category.name,
                channels: this.data.channels
                  .filter(channel => channel.parent_id === category.id)
                  .map(channel => ({
                    id: channel.id,
                    type: (
                      channel.type === 4 ? 'category' :
                        channel.type === 0 ? 'text' :
                          'voice'
                    ),
                    name: channel.name,
                    defaultFocused: this.data.channels.filter(({ type }) => type !== 4)[0].id === channel.id,
                    topic: channel.topic
                  }))
              }))
          ],
          roles: this.data.roles
            .reverse()
            .map(role => ({
              id: role.id,
              name: role.name,
              color: role.color ? convertToHex(role.color) : '#949ba4'
            }))
        }
      };
    }
  }
});

module.exports = mongoose.model('Template', TemplateSchema);