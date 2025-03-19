const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth'); // Import correto

// Criar um novo pedido
router.post('/', auth, async (req, res) => {
  try {
    console.log('Requisição recebida para criar pedido:', req.body);
    const { items, total, deliveryOption, address } = req.body;
    
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
      user: req.user.id,
      items,
      total,
      deliveryOption,
      address: deliveryOption === 'delivery' ? address : null,
      status: 'Pendente', // Adicionado explicitamente como padrão
      createdAt: new Date(),
    });

    console.log('Pedido a ser salvo:', order);
    const savedOrder = await order.save();
    console.log('Pedido salvo com sucesso:', savedOrder);
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Erro ao criar pedido:', err.message);
    res.status(500).json({ message: 'Erro ao criar pedido: ' + err.message });
  }
});

// Listar pedidos do usuário autenticado
router.get('/user', auth, async (req, res) => {
  try {
    console.log('Buscando pedidos do usuário:', req.user.id);
    const orders = await Order.find({ user: req.user.id }).populate('items.product', 'name price');
    console.log('Pedidos encontrados:', orders);
    res.json(orders);
  } catch (err) {
    console.error('Erro ao listar pedidos:', err.message);
    res.status(500).json({ message: 'Erro ao listar pedidos: ' + err.message });
  }
});

// Cancelar um pedido
router.put('/:id/cancel', auth, async (req, res) => { // Corrigido para 'auth'
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Pedido não encontrado' });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }
    if (order.status !== 'Pendente') {
      return res.status(400).json({ msg: 'Apenas pedidos pendentes podem ser cancelados' });
    }
    order.status = 'Cancelado';
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
