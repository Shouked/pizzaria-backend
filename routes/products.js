const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Obter todos os produtos de um tenant específico
router.get('/', async (req, res) => {
  try {
    const tenantId = req.query.tenantId || req.headers['x-tenant-id']; // Pegar tenantId do query ou header
    if (!tenantId) {
      console.log('tenantId não fornecido');
      return res.status(400).json({ message: 'tenantId é obrigatório' });
    }
    console.log('Iniciando busca de produtos para tenantId:', tenantId);
    const products = await Product.find({ tenantId }).lean();
    console.log('Produtos encontrados:', products);
    console.log('Número de produtos:', products.length);
    res.json(products);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Adicionar um novo produto (para testes)
router.post('/', async (req, res) => {
  try {
    const tenantId = req.body.tenantId;
    if (!tenantId) {
      console.log('tenantId não fornecido no POST');
      return res.status(400).json({ message: 'tenantId é obrigatório' });
    }
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      tenantId: tenantId, // Adicionado ao criar produto
    });
    const newProduct = await product.save();
    console.log('Produto adicionado:', newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Erro ao adicionar produto:', err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;