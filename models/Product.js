const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // ex.: "pizza", "sobremesa"
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, // URL da imagem
});

module.exports = mongoose.model('Product', productSchema);
