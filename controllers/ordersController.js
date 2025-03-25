const Order = require('../models/Order');

// ✅ GET: Pedidos do usuário autenticado
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({
      tenantId: req.tenant.tenantId,
      userId: req.user.userId
    }).populate('items.productId');

    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar pedidos do usuário' });
  }
};

// ✅ GET: Listar pedidos do usuário ou todos (se for admin)
exports.getOrders = async (req, res) => {
  try {
    const query = { tenantId: req.tenant.tenantId };

    if (!req.user.isAdmin) {
      query.userId = req.user.userId;
    }

    const orders = await Order.find(query).populate('items.productId');
    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ message: 'Erro ao buscar pedidos' });
  }
};

// ✅ GET: Buscar pedido específico
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      tenantId: req.tenant.tenantId
    }).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    if (!req.user.isAdmin && order.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Acesso negado a este pedido' });
    }

    res.json(order);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ message: 'Erro ao buscar pedido' });
  }
};

// ✅ POST: Criar pedido
exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    const newOrder = new Order({
      tenantId: req.tenant.tenantId,
      userId: req.user.userId,
      items,
      total,
      status: 'pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ message: 'Erro ao criar pedido' });
  }
};

// ✅ PUT: Atualizar status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, tenantId: req.tenant.tenantId },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ message: 'Erro ao atualizar pedido' });
  }
};

// ✅ DELETE: Excluir pedido
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findOneAndDelete({
      _id: orderId,
      tenantId: req.tenant.tenantId
    });

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.json({ message: 'Pedido excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({ message: 'Erro ao deletar pedido' });
  }
};
