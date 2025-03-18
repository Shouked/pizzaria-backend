const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [itemSchema],
  total: { type: Number, required: true },
  deliveryOption: { type: String, required: true, enum: ['delivery', 'pickup'] }, // Novo campo
  address: { // Novo campo, opcional
    cep: { type: String },
    street: { type: String },
    number: { type: String },
    neighborhood: { type: String },
    city: { type: String },
    complement: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
