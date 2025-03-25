const Order = require('../models/Order');

// GET: Listar pedidos do usuário ou de todos (se for admin)
exports.getOrders = async (req, res) => {
  try {
    const query = { tenantId: req.tenant.tenantId };

    // Se o usuário não for admin, ele só vê os próprios pedidos
    if (!req.user.isAdmin) {
      query.userId = req.user.userId;
    }

    const orders = await Order.find(query).populate('items.productId');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// GET: Buscar um pedido específico do tenant (admin ou dono do pedido)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      tenantId: req.tenant.tenantId
    }).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Se não for admin, só pode acessar o próprio pedido
    if (!req.user.isAdmin && order.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied to this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};

// POST: Criar novo pedido (usuário autenticado)
exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    const newOrder = new Order({
      tenantId: req.tenant.tenantId, // 🔄 Aqui usamos a string
      userId: req.user.userId,
      items,
      total,
      status: 'pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};

// PUT: Atualizar status de pedido (apenas admin)
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
      return res.status(404).json({ message: 'Order not found or access denied' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
};

// DELETE: Excluir um pedido (apenas admin)
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findOneAndDelete({
      _id: orderId,
      tenantId: req.tenant.tenantId
    });

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found or access denied' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error while deleting order' });
  }
};
