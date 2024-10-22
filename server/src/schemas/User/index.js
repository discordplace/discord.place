const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const decrypt = require('@/utils/encryption/decrypt');

const UserSchema = new Schema({
  acceptedPolicies: {
    default: false,
    required: true,
    type: Boolean
  },
  accessToken: {
    encryptedText: {
      required: false,
      type: String
    },
    iv: {
      required: false,
      type: String
    },
    tag: {
      required: false,
      type: String
    }
  },
  data: {
    required: false,
    type: Object
  },
  email: {
    required: false,
    type: String
  },
  id: {
    required: true,
    type: String
  },
  lastLoginAt: {
    required: false,
    type: Date
  },
  lastLogoutAt: {
    required: false,
    type: Date
  },
  oldSubscriptions: [
    {
      createdAt: {
        required: false,
        type: Date
      },
      expiredAt: {
        required: false,
        type: Date
      },
      id: {
        required: false,
        type: String
      },
      orderId: {
        required: false,
        type: String
      },
      planId: {
        required: false,
        type: Number
      },
      productId: {
        required: false,
        type: String
      }
    }
  ],
  subscription: {
    createdAt: {
      required: false,
      type: Date
    },
    expiresAt: {
      required: false,
      type: Date
    },
    id: {
      required: false,
      type: String
    },
    orderId: {
      required: false,
      type: String
    },
    planId: {
      required: false,
      type: Number
    },
    productId: {
      required: false,
      type: String
    }
  }
}, {
  methods: {
    getDecryptedAccessToken() {
      return decrypt(this.accessToken, process.env.USER_TOKEN_ENCRYPT_SECRET);
    }
  },
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);