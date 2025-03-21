const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  isAdmin: { type: Boolean, default: false },
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
  tenantId: { type: String }, // Adicionado como opcional
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
