const express = require('express');
const router = express.Router();

const tenantMiddleware = require('../middleware/tenant');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

const productsController = require('../controllers/productsController');

// ✅ ROTA PÚBLICA: listar todos os produtos do tenant
router.get('/:tenantId/products', tenantMiddleware, productsController.getAllProducts);

// ✅ Buscar um produto específico (requer login)
router.get('/:tenantId/products/:productId', tenantMiddleware, authMiddleware, productsController.getProductById);

// ✅ Criar produto (apenas para admin logado)
router.post(
  '/:tenantId/products',
  tenantMiddleware,
  authMiddleware,
  adminAuthMiddleware,
  productsController.createProduct
);

// ✅ Atualizar produto (apenas para admin logado)
router.put(
  '/:tenantId/products/:productId',
  tenantMiddleware,
  authMiddleware,
  adminAuthMiddleware,
  productsController.updateProduct
);

// ✅ Deletar produto (apenas para admin logado)
router.delete(
  '/:tenantId/products/:productId',
  tenantMiddleware,
  authMiddleware,
  adminAuthMiddleware,
  productsController.deleteProduct
);

module.exports = router;
