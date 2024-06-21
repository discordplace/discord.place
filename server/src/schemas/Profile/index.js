const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slugValidation = require('@/validations/profiles/slug');
const birthdayValidation = require('@/validations/profiles/birthday');
const colorsValidation = require('@/validations/profiles/colors');
const getBadges = require('@/utils/profiles/getBadges');

const ProfileSchema = new Schema({
  user: {
    id: {
      type: String,
      required: true
    }
  },
  occupation: {
    type: String,
    max: 64
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  location: {
    type: String,
    max: 64
  },
  birthday: {
    type: String,
    max: 32,
    validate: {
      validator: value => birthdayValidation(value),
      message: ({ reason }) => reason.message
    }
  },
  bio: {
    type: String,
    required: true,
    max: 512,
    default: 'No bio provided.'
  },
  socials: [
    {
      type: {
        type: String,
        enum: ['instagram', 'x', 'twitter', 'tiktok', 'facebook', 'steam', 'github', 'twitch', 'youtube', 'telegram', 'custom'],
        required: true
      },
      handle: {
        type: String,
        max: 256
      },
      link: {
        type: String,
        required: true,
        max: 256
      }
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  likes_count: {
    type: Number,
    default: 0
  },
  likes: {
    type: Array,
    default: []
  },
  slug: {
    type: String,
    required: true,
    validate: {
      validator: slugValidation,
      message: ({ reason }) => reason.message
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  preferredHost: {
    type: String,
    enum: ['discord.place/p', ...config.customHostnames],
    default: 'discord.place/p'
  },
  colors: {
    primary: {
      type: String,
      default: null,
      validate: {
        validator: value => colorsValidation({ primary: value, secondary: null }),
        message: ({ reason }) => reason.message
      }
    },
    secondary: {
      type: String,
      default: null,
      validate: {
        validator: value => colorsValidation({ primary: null, secondary: value }),
        message: ({ reason }) => reason.message
      }
    }
  }
}, {
  timestamps: true,
  methods: {
    async toPubliclySafe() {
      const User = require('@/schemas/User');
      const newProfile = {};
  
      if (!client.forceFetchedUsers.has(this.user.id)) {
        await client.users.fetch(this.user.id, { force: true }).catch(() => null);
        client.forceFetchedUsers.set(this.user.id, true);
      }

      const user = client.users.cache.get(this.user.id);      
      if (user) Object.assign(newProfile, {
        username: user.username,
        global_name: user.globalName,
        avatar_url: user.displayAvatarURL({ size: 256 }),
        banner_url: user.bannerURL({ size: 512, format: 'png' })
      });

      const premium = await User.findOne({ id: this.user.id, subscription: { $ne: null } });

      return {
        ...newProfile,
        occupation: this.occupation,
        gender: this.gender,
        location: this.location,
        birthday: this.birthday,
        bio: this.bio,
        socials: this.socials,
        views: this.views,
        likes: this.likes_count,
        slug: this.slug,
        verified: this.verified,
        preferredHost: this.preferredHost,
        colors: this.colors,
        premium: !!premium,
        badges: getBadges(this, premium ? premium.createdAt : null),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  }
});

const Model = mongoose.model('Profile', ProfileSchema);

Model.watch().on('change', async change => {
  if (change.operationType === 'update') {
    const profile = await Model.findById(change.documentKey._id);
    if (!profile) return;

    const likes_count = profile.likes.length;
    if (profile.likes_count === likes_count) return;

    profile.likes_count = likes_count;
    await profile.save();
  }
});

module.exports = Model;