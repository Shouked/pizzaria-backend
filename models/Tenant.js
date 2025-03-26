const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, unique: true }, // Adicionado
  name: { type: String, required: true },
  logoUrl: String,
  primaryColor: String,
  secondaryColor: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', TenantSchema);