const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuarantineSchema = new Schema({
  created_by: {
    id: {
      required: true,
      type: String
    },
    username: {
      required: false,
      type: String
    }
  },
  expire_at: {
    default: null,
    type: Date
  },
  guild: {
    id: {
      required: false,
      type: String
    },
    name: {
      required: false,
      type: String
    }
  },
  reason: {
    required: true,
    type: String
  },
  restriction: {
    enum: Object.keys(config.quarantineRestrictions),
    required: false,
    type: String,
    validate: {
      message: 'Invalid restriction for this type',
      validator: function validateRestriction(value) {
        const restriction = config.quarantineRestrictions[value];

        return restriction.available_to.includes(this.type);
      }
    }
  },
  type: {
    enum: config.quarantineTypes,
    required: true,
    type: String,
    validate: {
      validator: function validateType(value) {
        if (value === 'USER_ID' && !this?.user?.id) throw new Error('user.id is required for this type');
        if (value === 'GUILD_ID' && !this?.guild?.id) throw new Error('guild.id is required for this type');

        const restriction = config.quarantineRestrictions[this.restriction];
        if (!restriction.available_to.includes(value)) throw new Error('Invalid type for this restriction');
      }
    }
  },
  user: {
    id: {
      required: false,
      type: String
    },
    username: {
      required: false,
      type: String
    }
  }
}, {
  methods: {
    toPubliclySafe() {
      const newQuarantine = {};

      if (this.type === 'USER_ID') {
        Object.assign(newQuarantine, {
          user: {
            id: this.user.id,
            username: this.user.username
          }
        });
      }

      if (this.type === 'GUILD_ID') {
        Object.assign(newQuarantine, {
          guild: {
            id: this.guild.id
          }
        });
      }

      return {
        ...newQuarantine,
        created_at: this.createdAt,
        created_by: this.created_by,
        expire_at: this.expire_at,
        id: this._id,
        reason: this.reason,
        restriction: this.restriction,
        type: this.type
      };
    }
  },
  timestamps: true
});

QuarantineSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Quarantines', QuarantineSchema);