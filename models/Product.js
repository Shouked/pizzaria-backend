const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  tenantId: {
    type: String, // This matches the 'tenantId' string field of the tenant, not the _id
    required: true
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
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);