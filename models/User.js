const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    cep: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: String, required: true },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    complement: { type: String },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
