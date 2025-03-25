const express = require('express');
const router = express.Router();
const tenantMiddleware = require('../middleware/tenant');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');
const ordersController = require('../controllers/ordersController');

// Teste para garantir que as funções existem
console.log('✅ getOrders:', typeof ordersController.getOrders);
console.log('✅ createOrder:', typeof ordersController.createOrder);

// Listar pedidos do usuário ou todos se for admin
router.get('/:tenantId/orders', tenantMiddleware, authMiddleware, ordersController.getOrders);

// Ver pedido específico
router.get('/:tenantId/orders/:orderId', tenantMiddleware, authMiddleware, ordersController.getOrderById);

// Criar pedido
router.post('/:tenantId/orders', tenantMiddleware, authMiddleware, ordersController.createOrder);

// Atualizar status (apenas admin)
router.put('/:tenantId/orders/:orderId/status', tenantMiddleware, authMiddleware, adminAuthMiddleware, ordersController.updateOrderStatus);

// Excluir pedido (apenas admin)
router.delete('/:tenantId/orders/:orderId', tenantMiddleware, authMiddleware, adminAuthMiddleware, ordersController.deleteOrder);

module.exports = router;
