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
    type: String,
    required: true
  },
  expire_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  methods: {
    async toPubliclySafe() {
      const newQuarantine = {};

      const fetchedUsers = (await Promise.all(
        // Fetch users if they are not cached
        [...new Set(this.type === 'USER_ID' ? [this.user.id, this.created_by] : [this.created_by])].map(async id => {
          if (!id) return;

          if (client.forceFetchedUsers.has(id)) return client.users.cache.get(id);

          await client.users.fetch(id, { force: true }).catch(() => null);
          client.forceFetchedUsers.set(id, true);

          return client.users.cache.get(id);
        })
      )).filter(Boolean); // Filter out undefined values

      const created_by = fetchedUsers.find(user => user.id === this.created_by);

      Object.assign(newQuarantine, {
        created_by: created_by ? {
          id: created_by.id,
          username: created_by.username,
          avatar_url: created_by.displayAvatarURL({ dynamic: true })
        } : this.created_by
      });

      if (this.type === 'USER_ID') {
        const user = fetchedUsers.find(user => user.id === this.user.id);

        Object.assign(newQuarantine, {
          user: user ? {
            id: user.id,
            username: user.username,
            avatar_url: user.displayAvatarURL({ dynamic: true })
          } : this.user.id
        });
      }

      if (this.type === 'GUILD_ID') {
        const guild = client.guilds.cache.get(this.guild.id);

        Object.assign(newQuarantine, {
          guild: guild ? {
            id: guild.id,
            name: guild.name,
            icon_url: guild.iconURL({ dynamic: true })
          } : this.guild.id
        });
      }

      return {
        ...newQuarantine,
        id: this._id,
        type: this.type,
        restriction: this.restriction,
        reason: this.reason,
        created_at: this.createdAt,
        expire_at: this.expire_at
      };
    }
  }
});

QuarantineSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Quarantines', QuarantineSchema);