const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Listar todos os produtos
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
});

// Adicionar um produto
router.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar produto' });
    }
});

module.exports = router;
