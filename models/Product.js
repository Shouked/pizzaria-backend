// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true // Obriga que cada produto pertença a um tenant específico
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  imageUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);