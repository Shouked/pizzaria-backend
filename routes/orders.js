const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Criar um novo pedido
router.post('/', auth, async (req, res) => {
  try {
    console.log('Requisição recebida para criar pedido:', req.body); // Log para depuração
    const { items, total, deliveryOption, address } = req.body;
    
    // Validar dados
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Itens do pedido são obrigatórios.' });
    }
    if (!total || isNaN(total)) {
      return res.status(400).json({ message: 'Total do pedido é inválido.' });
    }
    if (!deliveryOption || !['delivery', 'pickup'].includes(deliveryOption)) {
      return res.status(400).json({ message: 'Opção de entrega inválida.' });
    }

    const order = new Order({
      user: req.user.id, // ID do usuário autenticado pelo middleware auth
      items,
      total,
      deliveryOption,
      address: deliveryOption === 'delivery' ? address : null, // Endereço só se for entrega
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

// Listar pedidos do usuário autenticado
router.get('/user', auth, async (req, res) => {
  try {
    console.log('Buscando pedidos do usuário:', req.user.id); // Log para depuração
    const orders = await Order.find({ user: req.user.id });
    console.log('Pedidos encontrados:', orders); // Log para depuração
    res.json(orders);
  } catch (err) {
    console.error('Erro ao listar pedidos:', err.message); // Log detalhado do erro
    res.status(500).json({ message: 'Erro ao listar pedidos: ' + err.message });
  }
});

module.exports = router;
