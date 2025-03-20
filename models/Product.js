const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  tenantId: { type: String, required: true }, // Adicionado para multi-tenancy
});

module.exports = mongoose.model('Product', productSchema);