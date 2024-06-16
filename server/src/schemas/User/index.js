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
    required: false
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