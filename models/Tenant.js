// models/Tenant.js
const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  cep: { type: String },
  street: { type: String },
  number: { type: String },
}, { _id: false });

const TenantSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logoUrl: String,
  primaryColor: String,
  secondaryColor: String,
  phone: { type: String },
  address: AddressSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', TenantSchema);
