const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slugValidation = require('@/validations/profiles/slug');
const birthdayValidation = require('@/validations/profiles/birthday');
const getBadges = require('@/utils/profiles/getBadges');
const Premium = require('@/schemas/Premium');

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
      message: ({ value }) => `${value} should be a valid date in the format of MM/DD/YYYY.`
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
        enum: ['instagram', 'x', 'twitter', 'tiktok', 'facebook', 'steam', 'github', 'twitch', 'youtube', 'custom'],
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
      },
    }
  ],
  views: {
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
      message: ({ value }) => `${value} is not a valid slug.`,
    },
  },
  verified: {
    type: Boolean,
    default: false
  },
  preferredHost: {
    type: String,
    enum: ['discord.place/p', 'dsc.wtf'],
    default: 'discord.place/p'
  }
}, {
  timestamps: true,
  methods: {
    async toPubliclySafe() {
      const newProfile = {};
  
      const user = client.users.cache.get(this.user.id) || await client.users.fetch(this.user.id).catch(() => null);
      if (user) Object.assign(newProfile, {
        username: user.username,
        avatar_url: user.displayAvatarURL({ size: 256 })
      });

      const premium = await Premium.findOne({ 'user.id': this.user.id });

      return {
        ...newProfile,
        occupation: this.occupation,
        gender: this.gender,
        location: this.location,
        birthday: this.birthday,
        bio: this.bio,
        socials: this.socials,
        views: this.views,
        likes: this.likes.length,
        slug: this.slug,
        verified: this.verified,
        preferredHost: this.preferredHost,
        premium: premium ? true : false,
        badges: getBadges(this, premium ? true : false),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);