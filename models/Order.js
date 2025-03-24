const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  tenantId: {
    type: String, // 🔥 Agora é o slug
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    productId: {
      type:
