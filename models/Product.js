const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  tenantId: {
    type: String, // 🔥 Agora é o slug
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
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
