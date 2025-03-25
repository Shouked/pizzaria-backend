const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: String,
  number: String,
  neighborhood: String,
  city: String,
  state: String,
  zip: String,
}, { _id: false });

const UserSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: false, // pode haver mesmo email em tenants diferentes
    lowercase: true,
    trim: true
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
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);