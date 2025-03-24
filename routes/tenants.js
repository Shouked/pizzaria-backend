const express = require('express');
const router = express.Router();

const tenantsController = require('../controllers/tenantsController');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth'); // Você pode criar um superAdmin se quiser

// Listar todos os tenants (apenas admins)
router.get('/', authMiddleware, adminAuthMiddleware, tenantsController.getAllTenants);

// Pegar tenant específico
router.get('/:tenantId', authMiddleware, adminAuthMiddleware, tenantsController.getTenantById);

// Criar um tenant (apenas admins)
router.post('/', authMiddleware, adminAuthMiddleware, tenantsController.createTenant);

// Atualizar tenant (apenas admins)
router.put('/:tenantId', authMiddleware, adminAuthMiddleware, tenantsController.updateTenant);

// Excluir tenant (apenas admins)
router.delete('/:tenantId', authMiddleware, adminAuthMiddleware, tenantsController.deleteTenant);

module.exports = router;