const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  tenantId: { type: String, required: true }, // Identificador da pizzaria (ex.: "pizzaria-a")
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);
