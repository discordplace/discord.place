const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function convertToHex(color) {
  return `#${color.toString(16).padStart(6, '0')}`;
}

const TemplateSchema = new Schema({
  approved: {
    default: false,
    type: Boolean
  },
  categories: {
    max: config.templateMaxCategoriesLength,
    required: true,
    type: [
      {
        enum: config.templateCategories,
        type: String
      }
    ]
  },
  data: {
    required: true,
    type: Object
  },
  description: {
    max: config.templateMaxDescriptionLength,
    min: config.templateMinDescriptionLength,
    required: true,
    type: String
  },
  id: {
    required: true,
    type: String
  },
  name: {
    max: config.templateMaxNameLength,
    required: true,
    type: String
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
  uses: {
    default: 0,
    type: Number
  }
}, {
  methods: {
    toPubliclySafe() {
      const newTemplate = {};

      return {
        ...newTemplate,
        approved: this.approved,
        categories: this.categories,
        created_at: new Date(this.createdAt),
        data: {
          channels: [
            ...this.data.channels.filter(({ parent_id, type }) => type !== 4 && !parent_id)
              .map(channel => ({
                defaultFocused: this.data.channels.filter(({ type }) => type !== 4)[0].id === channel.id,
                id: channel.id,
                name: channel.name,
                topic: channel.topic,
                type: (
                  channel.type === 4 ? 'category' :
                    channel.type === 0 ? 'text' :
                      'voice'
                )
              })),
            ...this.data.channels.filter(({ type }) => type === 4)
              .map(category => ({
                channels: this.data.channels
                  .filter(channel => channel.parent_id === category.id)
                  .map(channel => ({
                    defaultFocused: this.data.channels.filter(({ type }) => type !== 4)[0].id === channel.id,
                    id: channel.id,
                    name: channel.name,
                    topic: channel.topic,
                    type: (
                      channel.type === 4 ? 'category' :
                        channel.type === 0 ? 'text' :
                          'voice'
                    )
                  })),
                id: category.id,
                name: category.name,
                type: 'category'
              }))
          ],
          roles: this.data.roles
            .reverse()
            .map(role => ({
              color: role.color ? convertToHex(role.color) : '#949ba4',
              id: role.id,
              name: role.name
            }))
        },
        description: this.description,
        id: this.id,
        name: this.name,
        user: {
          id: this.user.id,
          username: this.user.username
        },
        uses: this.uses
      };
    }
  },
  timestamps: true
});

module.exports = mongoose.model('Template', TemplateSchema);