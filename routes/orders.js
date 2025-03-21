const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Criar um novo pedido
router.post('/', auth, async (req, res) => {
  try {
    console.log('Requisição recebida para criar pedido:', req.body);
    const { items, total, deliveryOption, address, tenantId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Itens do pedido são obrigatórios.' });
    }
    if (!total || isNaN(total)) {
      return res.status(400).json({ message: 'Total do pedido é inválido.' });
    }
    if (!deliveryOption || !['delivery', 'pickup'].includes(deliveryOption)) {
      return res.status(400).json({ message: 'Opção de entrega inválida.' });
    }
    if (!tenantId) {
      return res.status(400).json({ message: 'tenantId é obrigatório.' });
    }

    const order = new Order({
      user: req.user.id,
      items,
      total,
      deliveryOption,
      address: deliveryOption === 'delivery' ? address : null,
      status: 'Pendente',
      createdAt: new Date(),
      tenantId, // Adiciona tenantId ao pedido
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
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ message: 'tenantId é obrigatório.' });
    }
    console.log('Buscando pedidos do usuário:', req.user.id, 'para tenantId:', tenantId);
    const orders = await Order.find({ user: req.user.id, tenantId }).populate('items.product', 'name price');
    console.log('Pedidos encontrados:', orders);
    res.json(orders);
  } catch (err) {
    console.error('Erro ao listar pedidos:', err.message);
    res.status(500).json({ message: 'Erro ao listar pedidos: ' + err.message });
  }
});

// Cancelar um pedido
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    console.log('Tentando cancelar pedido com ID:', req.params.id);
    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log('Pedido não encontrado para ID:', req.params.id);
      return res.status(404).json({ msg: 'Pedido não encontrado' });
    }
    console.log('Pedido encontrado:', order);

    if (order.user.toString() !== req.user.id) {
      console.log('Usuário não autorizado. User do pedido:', order.user, 'User da requisição:', req.user.id);
      return res.status(401).json({ msg: 'Não autorizado' });
    }
    if (order.status !== 'Pendente') {
      console.log('Status do pedido não permite cancelamento:', order.status);
      return res.status(400).json({ msg: 'Apenas pedidos pendentes podem ser cancelados' });
    }

    order.status = 'Cancelado';
    const updatedOrder = await order.save();
    console.log('Pedido cancelado com sucesso:', updatedOrder);
    res.json(updatedOrder);
  } catch (err) {
    console.error('Erro ao cancelar pedido:', err.stack);
    res.status(500).json({ message: 'Erro ao cancelar pedido: ' + err.message });
  }
});

module.exports = router;