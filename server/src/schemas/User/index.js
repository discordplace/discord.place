const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const decrypt = require('@/utils/encryption/decrypt');

const UserSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: false
  },
  acceptedPolicies: {
    type: Boolean,
    required: true,
    default: false
  },
  email: {
    type: String,
    required: false
  },
  applicationsEntitlementsScopeGranted: {
    type: Boolean,
    required: false,
    default: false
  },
  accessToken: {
    iv: {
      type: String,
      required: false
    },
    encryptedText: {
      type: String,
      required: false
    },
    tag: {
      type: String,
      required: false
    }
  },
  lastLoginAt: {
    type: Date,
    required: false
  },
  lastLogoutAt: {
    type: Date,
    required: false
  },
  subscription: {
    id: {
      type: String,
      required: false
    },
    orderId: {
      type: String,
      required: false
    },
    productId: {
      type: String,
      required: false
    },
    planId: {
      type: Number,
      required: false
    },
    createdAt: {
      type: Date,
      required: false
    },
    expiresAt: {
      type: Date,
      required: false
    }
  },
  oldSubscriptions: [
    {
      id: {
        type: String,
        required: false
      },
      orderId: {
        type: String,
        required: false
      },
      productId: {
        type: String,
        required: false
      },
      planId: {
        type: Number,
        required: false
      },
      createdAt: {
        type: Date,
        required: false
      },
      expiredAt: {
        type: Date,
        required: false
      }
    }
  ]
}, {
  timestamps: true,
  methods: {
    getDecryptedAccessToken() {
      return decrypt(this.accessToken, process.env.USER_TOKEN_ENCRYPT_SECRET);
    }
  }
});

module.exports = mongoose.model('User', UserSchema);