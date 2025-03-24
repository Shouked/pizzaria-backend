const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  tenantId: {
    type: String, // 🔥 Agora é o slug
    required: true
  },
  name: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
