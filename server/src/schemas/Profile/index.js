const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slugValidation = require('@/validations/profiles/slug');
const birthdayValidation = require('@/validations/profiles/birthday');
const colorsValidation = require('@/validations/profiles/colors');
const getBadges = require('@/utils/profiles/getBadges');
const getUserHashes = require('@/utils/getUserHashes');

const ProfileSchema = new Schema({
  user: {
    id: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: false
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
  dailyStats: [
    {
      createdAt: {
        type: Date,
        default: Date.now
      },
      views: {
        type: Number,
        default: 0
      },
      likes: {
        type: Number,
        default: 0
      }
    }
  ],
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
        validator: value => colorsValidation({ primary: value, secondary: null }, true),
        message: ({ reason }) => reason.message
      }
    },
    secondary: {
      type: String,
      default: null,
      validate: {
        validator: value => colorsValidation({ primary: null, secondary: value }, true),
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

      const userHashes = await getUserHashes(this.user.id);

      const premiumUserData = await User.findOne({ id: this.user.id, subscription: { $ne: null } });

      return {
        ...newProfile,
        id: this.user.id,
        username: this.user.data.username,
        global_name: this.user.data.global_name,
        avatar: userHashes.avatar,
        banner: userHashes.banner,
        occupation: this.occupation,
        gender: this.gender,
        location: this.location,
        birthday: this.birthday,
        bio: this.bio,
        socials: this.socials,
        views: this.views,
        likes: this.likes_count,
        dailyStats: this.dailyStats,
        slug: this.slug,
        verified: this.verified,
        preferredHost: this.preferredHost,
        colors: this.colors,
        premium: !!premiumUserData,
        subscriptionCreatedAt: premiumUserData?.subscription?.createdAt ? new Date(premiumUserData.subscription.createdAt).getTime() : null,
        badges: getBadges(this, premiumUserData ? premiumUserData.subscription?.createdAt : null),
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