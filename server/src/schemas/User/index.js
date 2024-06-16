const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const decrypt = require('@/utils/encryption/decrypt');

const UserSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  acceptedPolicies: {
    type: Boolean,
    required: true,
    default: false
  },
  email: {
    type: String,
    required: true
  },
  accessToken: {
    iv: {
      type: String,
      required: true
    },
    encryptedText: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true,
  methods: {
    getDecryptedAccessToken() {
      return decrypt(this.accessToken, process.env.USER_TOKEN_ENCRYPT_SECRET);
    }
  }
});

module.exports = mongoose.model('User', UserSchema);