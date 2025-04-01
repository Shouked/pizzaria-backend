const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  zip: { type: String },
  street: { type: String }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: function () {
      return !this.isSuperAdmin;
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: false // importante: o email pode se repetir em tenants diferentes
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  address: {
    type: AddressSchema
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);