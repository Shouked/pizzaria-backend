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
  phone: { type: String }, // telefone do dono da pizzaria
  address: { type: AddressSchema }, // endereço da pizzaria
  primaryColor: String,
  secondaryColor: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', TenantSchema);