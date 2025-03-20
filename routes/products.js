const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Listar produtos do tenant atual
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ tenantId: req.tenantId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar produtos', error: err.message });
  }
});

// Criar um novo produto para o tenant atual
router.post('/', async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      tenantId: req.tenantId, // Adiciona o tenantId automaticamente
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar produto', error: err.message });
  }
});

// Atualizar um produto
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar produto', error: err.message });
  }
});

// Deletar um produto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto deletado' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar produto', error: err.message });
  }
});

module.exports = router;
