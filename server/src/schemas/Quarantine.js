const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuarantineSchema = new Schema({
  type: {
    type: String,
    enum: config.quarantineTypes,
    required: true,
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
      type: String,
      required: false
    },
    username: {
      type: String,
      required: false
    }
  },
  guild: {
    id: {
      type: String,
      required: false
    }
  },
  restriction: {
    type: String,
    required: false,
    enum: Object.keys(config.quarantineRestrictions),
    validate: {
      validator: function validateRestriction(value) {
        const restriction = config.quarantineRestrictions[value];
        return restriction.available_to.includes(this.type);
      },
      message: 'Invalid restriction for this type'
    }
  },
  reason: {
    type: String,
    required: true
  },
  created_by: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: false
    }
  },
  expire_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
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
        id: this._id,
        type: this.type,
        restriction: this.restriction,
        reason: this.reason,
        created_by: this.created_by.id,
        created_at: this.createdAt,
        expire_at: this.expire_at
      };
    }
  }
});

QuarantineSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Quarantines', QuarantineSchema);