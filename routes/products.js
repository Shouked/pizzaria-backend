const express = require('express');
const router = express.Router();
const tenantMiddleware = require('../middleware/tenant');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');
const productsController = require('../controllers/productsController');

// ROTAS PROTEGIDAS POR TENANT E USUÁRIO
router.get('/:tenantId/products', tenantMiddleware, authMiddleware, productsController.getAllProducts);
router.get('/:tenantId/products/:productId', tenantMiddleware, authMiddleware, productsController.getProductById);

// SOMENTE ADMIN PODE CRIAR/EDITAR/EXCLUIR
router.post('/:tenantId/products', tenantMiddleware, authMiddleware, adminAuthMiddleware, productsController.createProduct);
router.put('/:tenantId/products/:productId', tenantMiddleware, authMiddleware, adminAuthMiddleware, productsController.updateProduct);
router.delete('/:tenantId/products/:productId', tenantMiddleware, authMiddleware, adminAuthMiddleware, productsController.deleteProduct);

module.exports = router;