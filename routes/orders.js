const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Criar um novo pedido
router.post('/', auth, async (req, res) => {
  try {
    console.log('Requisição recebida para criar pedido:', req.body); // Log para depuração
    const { items, total } = req.body;
    
    // Validar dados
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Itens do pedido são obrigatórios.' });
    }
    if (!total || isNaN(total)) {
      return res.status(400).json({ message: 'Total do pedido é inválido.' });
    }

    const order = new Order({
      user: req.user.id, // ID do usuário autenticado pelo middleware auth
      items,
      total,
      createdAt: new Date(),
    });

    console.log('Pedido a ser salvo:', order); // Log para depuração
    const savedOrder = await order.save();
    console.log('Pedido salvo com sucesso:', savedOrder); // Log para depuração
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Erro ao criar pedido:', err.message); // Log detalhado do erro
    res.status(500).json({ message: 'Erro ao criar pedido: ' + err.message });
  }
});

module.exports = router;