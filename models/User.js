// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  name: String,
  email: {
    type: String,
    unique: true, // Cuidado: se quiser o mesmo email em tenants diferentes, remova o unique!
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);