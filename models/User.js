const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  zip: { type: String },
  street: { type: String }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: function() { return !this.isSuperAdmin; } // Obrigatório apenas se não for superadmin
  },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: AddressSchema },
  isAdmin: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
