const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getUserHashes = require('@/utils/getUserHashes');
const getBadges = require('@/utils/profiles/getBadges');
const birthdayValidation = require('@/validations/profiles/birthday');
const colorsValidation = require('@/validations/profiles/colors');
const slugValidation = require('@/validations/profiles/slug');

const ProfileSchema = new Schema({
  bio: {
    default: 'No bio provided.',
    max: 512,
    required: true,
    type: String
  },
  birthday: {
    max: 32,
    type: String,
    validate: {
      message: ({ reason }) => reason.message,
      validator: value => birthdayValidation(value)
    }
  },
  colors: {
    primary: {
      default: null,
      type: String,
      validate: {
        message: ({ reason }) => reason.message,
        validator: value => colorsValidation({ primary: value, secondary: null }, true)
      }
    },
    secondary: {
      default: null,
      type: String,
      validate: {
        message: ({ reason }) => reason.message,
        validator: value => colorsValidation({ primary: null, secondary: value }, true)
      }
    }
  },
  dailyStats: [
    {
      createdAt: {
        default: Date.now,
        type: Date
      },
      likes: {
        default: 0,
        type: Number
      },
      views: {
        default: 0,
        type: Number
      }
    }
  ],
  gender: {
    enum: ['Male', 'Female'],
    type: String
  },
  likes: {
    default: [],
    type: Array
  },
  likes_count: {
    default: 0,
    type: Number
  },
  location: {
    max: 64,
    type: String
  },
  occupation: {
    max: 64,
    type: String
  },
  preferredHost: {
    default: 'discord.place/p',
    enum: ['discord.place/p', ...config.customHostnames],
    type: String
  },
  slug: {
    required: true,
    type: String,
    validate: {
      message: ({ reason }) => reason.message,
      validator: slugValidation
    }
  },
  socials: [
    {
      handle: {
        max: 256,
        type: String
      },
      link: {
        max: 256,
        required: true,
        type: String
      },
      type: {
        enum: ['instagram', 'x', 'twitter', 'tiktok', 'facebook', 'steam', 'github', 'twitch', 'youtube', 'telegram', 'custom'],
        required: true,
        type: String
      }
    }
  ],
  user: {
    data: {
      required: false,
      type: Object
    },
    id: {
      required: true,
      type: String
    }
  },
  verified: {
    default: false,
    type: Boolean
  },
  views: {
    default: 0,
    type: Number
  }
}, {
  methods: {
    async toPubliclySafe() {
      const User = require('@/schemas/User');
      const newProfile = {};

      const userHashes = await getUserHashes(this.user.id);

      const premiumUserData = await User.findOne({ id: this.user.id, subscription: { $ne: null } });

      return {
        ...newProfile,
        avatar: userHashes.avatar,
        badges: getBadges(this, premiumUserData ? premiumUserData.subscription?.createdAt : null),
        banner: userHashes.banner,
        bio: this.bio,
        birthday: this.birthday,
        colors: this.colors,
        createdAt: this.createdAt,
        dailyStats: this.dailyStats,
        gender: this.gender,
        global_name: this.user.data.global_name,
        id: this.user.id,
        likes: this.likes_count,
        location: this.location,
        occupation: this.occupation,
        preferredHost: this.preferredHost,
        premium: !!premiumUserData,
        slug: this.slug,
        socials: this.socials,
        subscriptionCreatedAt: premiumUserData?.subscription?.createdAt ? new Date(premiumUserData.subscription.createdAt).getTime() : null,
        updatedAt: this.updatedAt,
        username: this.user.data.username,
        verified: this.verified,
        views: this.views
      };
    }
  },
  timestamps: true
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