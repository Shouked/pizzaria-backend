const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, unique: true }, // ex.: "pizzaria-joao"
  name: { type: String, required: true }, // ex.: "Pizzaria do João"
  description: { type: String }, // opcional
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tenant', tenantSchema);
